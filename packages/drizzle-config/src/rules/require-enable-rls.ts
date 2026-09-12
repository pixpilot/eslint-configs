import type { Rule } from 'eslint';

/**
 * Require every `pgTable()` call imported from `drizzle-orm/pg-core` to be
 * chained with `.enableRLS()`, so Row Level Security is never left off.
 */
export const requireEnableRlsRule: Rule.RuleModule = {
  create(context) {
    const drizzlePgTableBindings = new Set<string>();

    return {
      CallExpression(node) {
        const calleeName = node.callee.type === 'Identifier' ? node.callee.name : null;

        if (calleeName === null || !drizzlePgTableBindings.has(calleeName)) return;

        const { parent } = node;
        const isChainedWithRls =
          parent?.type === 'MemberExpression' &&
          parent.property.type === 'Identifier' &&
          parent.property.name === 'enableRLS' &&
          parent.parent?.type === 'CallExpression';

        if (!isChainedWithRls) context.report({ messageId: 'missingRls', node });
      },
      ImportDeclaration(node) {
        if (
          node.source.type !== 'Literal' ||
          node.source.value !== 'drizzle-orm/pg-core'
        ) {
          return;
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name === 'pgTable'
          ) {
            drizzlePgTableBindings.add(specifier.local.name);
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Every pgTable() call must be chained with .enableRLS() for Supabase/Postgres RLS.',
    },
    messages: {
      missingRls:
        'pgTable() is missing .enableRLS(). All tables must have Row Level Security enabled.',
    },
    schema: [],
    type: 'problem',
  },
};
