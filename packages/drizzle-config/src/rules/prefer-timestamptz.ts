import type { Rule } from 'eslint';

/**
 * Enforce `withTimezone: true` on `timestamp()` calls imported from
 * `drizzle-orm/pg-core`, so columns are stored as `timestamptz`.
 */
export const preferTimestamptzRule: Rule.RuleModule = {
  create(context) {
    const drizzleTimestampBindings = new Set<string>();

    return {
      CallExpression(node) {
        const calleeName = node.callee.type === 'Identifier' ? node.callee.name : null;

        if (calleeName === null || !drizzleTimestampBindings.has(calleeName)) return;

        if (node.arguments.length === 0) {
          context.report({ messageId: 'bareCall', node });
          return;
        }

        const optionsArg = node.arguments.find((arg) => arg.type === 'ObjectExpression');

        if (!optionsArg) {
          context.report({ messageId: 'useTimestamptz', node });
          return;
        }

        const withTimezoneProperty = optionsArg.properties.find((prop) => {
          if (prop.type !== 'Property') return false;

          if (prop.key.type === 'Identifier') return prop.key.name === 'withTimezone';

          return prop.key.type === 'Literal' && prop.key.value === 'withTimezone';
        });

        if (!withTimezoneProperty) {
          context.report({ messageId: 'useTimestamptz', node });
          return;
        }

        if (
          withTimezoneProperty.type === 'Property' &&
          withTimezoneProperty.value.type === 'Literal' &&
          withTimezoneProperty.value.value !== true
        ) {
          context.report({ messageId: 'useTimestamptz', node });
        }
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
            specifier.imported.name === 'timestamp'
          ) {
            drizzleTimestampBindings.add(specifier.local.name);
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Enforce withTimezone: true on timestamp() calls from drizzle-orm/pg-core.',
    },
    messages: {
      bareCall:
        "timestamp() called with no options. Import { withTimezone } from '@pixpilot/drizzle-pg' and spread it, or pass { withTimezone: true }.",
      useTimestamptz:
        "timestamp() is missing { withTimezone: true }. Import { withTimezone } from '@pixpilot/drizzle-pg' and spread it, or add { withTimezone: true } explicitly.",
    },
    schema: [],
    type: 'problem',
  },
};
