import type { Rule } from 'eslint';

const DEFAULT_COLUMNS = ['user_id'];
const PG_CORE_MODULE = 'drizzle-orm/pg-core';
const CASCADE_SNIPPET = ".references(() => authUsers.id, { onDelete: 'cascade' })";

interface ChainedMethod {
  call: Rule.Node;
  name: string | null;
}

/**
 * Walks a Drizzle column builder chain upwards from the `uuid('user_id')` call,
 * e.g. `uuid('user_id').notNull().references(...)`.
 *
 * Returns the chained method calls and the outermost call of the chain.
 */
function readBuilderChain(uuidCall: Rule.Node): {
  methods: ChainedMethod[];
  last: Rule.Node;
} {
  const methods: ChainedMethod[] = [];
  let current = uuidCall;

  for (;;) {
    const member = current.parent;
    if (member?.type !== 'MemberExpression' || member.object !== (current as never))
      break;

    const call = member.parent;
    if (call?.type !== 'CallExpression' || call.callee !== (member as never)) break;

    methods.push({
      call,
      name:
        member.computed || member.property.type !== 'Identifier'
          ? null
          : member.property.name,
    });
    current = call;
  }

  return { methods, last: current };
}

/**
 * True when `.references()` was given `{ onDelete: 'cascade' }`.
 */
function hasCascadeOption(referencesCall: Rule.Node): boolean {
  if (referencesCall.type !== 'CallExpression') return false;

  const options = referencesCall.arguments[1];
  if (options?.type !== 'ObjectExpression') return false;

  return options.properties.some((property) => {
    if (property.type !== 'Property' || property.computed) return false;

    if (property.value.type !== 'Literal' || property.value.value !== 'cascade') {
      return false;
    }

    if (property.key.type === 'Identifier') return property.key.name === 'onDelete';

    return property.key.type === 'Literal' && property.key.value === 'onDelete';
  });
}

/**
 * A user-owned column that is not wired to `auth.users` with
 * `ON DELETE CASCADE` silently outlives the account it belongs to, which is
 * both an orphaned-row bug and a GDPR erasure problem.
 */
export const requireUserIdCascadeRule: Rule.RuleModule = {
  create(context) {
    const columns = new Set<string>(
      (context.options[0] as { columns?: string[] } | undefined)?.columns ??
        DEFAULT_COLUMNS,
    );
    /** Local names `uuid` was imported under, so only Drizzle columns are checked. */
    const uuidNames = new Set<string>();
    let authUsersImported = false;

    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || !uuidNames.has(node.callee.name)) return;

        const [columnArg] = node.arguments;
        if (columnArg?.type !== 'Literal' || typeof columnArg.value !== 'string') return;

        const column = columnArg.value;
        if (!columns.has(column)) return;

        const { methods, last } = readBuilderChain(node);
        const references = methods.find((method) => method.name === 'references');

        if (references) {
          if (hasCascadeOption(references.call)) return;

          context.report({ data: { column }, messageId: 'missingCascade', node });
          return;
        }

        context.report({
          data: { column, snippet: CASCADE_SNIPPET },
          messageId: 'missingReference',
          node,
          /*
           * Only offered when `authUsers` is already in scope, otherwise the
           * suggestion would produce code that does not compile.
           */
          suggest: authUsersImported
            ? [
                {
                  data: { snippet: CASCADE_SNIPPET },
                  fix: (fixer) => fixer.insertTextAfter(last, CASCADE_SNIPPET),
                  messageId: 'addCascadeReference',
                },
              ]
            : [],
        });
      },

      Program(program) {
        for (const statement of program.body) {
          if (statement.type !== 'ImportDeclaration') continue;

          for (const specifier of statement.specifiers) {
            if (
              specifier.type !== 'ImportSpecifier' ||
              specifier.imported.type !== 'Identifier'
            ) {
              continue;
            }

            if (specifier.imported.name === 'authUsers') authUsersImported = true;

            if (
              specifier.imported.name === 'uuid' &&
              statement.source.value === PG_CORE_MODULE
            ) {
              uuidNames.add(specifier.local.name);
            }
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Require user-owned uuid columns to cascade-delete with the auth user they belong to.',
    },
    hasSuggestions: true,
    messages: {
      addCascadeReference: 'Add `{{snippet}}`',
      missingCascade:
        "`uuid('{{column}}')` has a foreign key but not `onDelete: 'cascade'`, so deleting the auth user leaves this row behind (or fails on the constraint). Pass `{ onDelete: 'cascade' }` to `.references()`. If another delete behaviour is intended, allow it explicitly: `// eslint-disable-next-line drizzle/require-user-id-cascade -- <reason>`.",
      missingReference:
        "`uuid('{{column}}')` has no foreign key, so these rows survive the account that owns them (orphaned data, and deleting the auth user no longer erases it). Add `{{snippet}}` — `authUsers` comes from '@pixpilot/drizzle-supabase'. If this column must outlive the account, allow it explicitly: `// eslint-disable-next-line drizzle/require-user-id-cascade -- <reason>`.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          columns: {
            items: { type: 'string' },
            minItems: 1,
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
};
