import type { ESLint, Rule } from 'eslint';
import type { TypedFlatConfigItem } from '../types';
import { GLOB_TS, GLOB_TSX, typescript } from '@pixpilot/antfu-eslint-config';

/**
 * Wraps an ESLint rule and removes its auto-fix capability. Works by:
 *  - Clearing `meta.fixable` so ESLint's fix-application logic is never
 *    triggered for this rule instance.
 *  - Using `Object.create` + `Object.defineProperty` inside `create()` to
 *    shadow `context.report` with a version that strips the `fix` property.
 *    ESLint v9 marks `context.report` as a non-writable own property, which
 *    causes direct assignment and Proxy get-traps to throw; `Object.defineProperty`
 *    on the derived (shadow) object bypasses the prototype's non-writable
 *    constraint and installs the own property cleanly.
 */
function createNoAutofixWrapper(rule: Rule.RuleModule): Rule.RuleModule {
  return {
    ...rule,
    meta: { ...rule.meta, fixable: undefined },
    create(context: Rule.RuleContext): Rule.RuleListener {
      const shadowContext = Object.create(context) as Rule.RuleContext;
      Object.defineProperty(shadowContext, 'report', {
        value({ fix: _fix, ...rest }: { fix?: unknown; [key: string]: unknown }) {
          context.report(rest as unknown as Rule.ReportDescriptor);
        },
        writable: true,
        configurable: true,
      });
      return rule.create(shadowContext);
    },
  };
}

/**
 * Returns ESLint config for promise-related rules.
 *
 * For plain `.ts` files, enables `ts/promise-function-async` but allows
 * functions whose return type is explicitly annotated as `ReactNode`.
 *
 * For `.tsx` files, In React 19 `ReactNode` is widened to include
 * `Promise<AwaitedReactNode>`, so any function returning `ReactNode` (or its
 * TypeScript-inferred expanded union) would incorrectly trigger the rule even
 * without an explicit annotation. The rule is re-registered under a custom
 * plugin namespace that strips `meta.fixable` — warnings appear in the IDE but
 * the auto-fixer never inserts the `async` keyword.
 *
 * This rule requires parser services, so it must be limited to typed TS/TSX
 * files and not run on JS files or Markdown virtual code blocks.
 */
export async function promiseConfigs(): Promise<TypedFlatConfigItem[]> {
  /*
   * Call typescript() with no options purely to obtain the bundled
   * @typescript-eslint/eslint-plugin object. The returned configs are
   * discarded — only the plugin reference is used.
   */
  const tsConfigs = await typescript();
  const tsPlugin: ESLint.Plugin | undefined = tsConfigs.find(
    (c) => c.plugins?.['ts'] !== undefined,
  )?.plugins?.['ts'] as ESLint.Plugin | undefined;
  const originalRule = tsPlugin?.rules?.['promise-function-async'] as
    | Rule.RuleModule
    | undefined;
  const noAutofixRule = originalRule ? createNoAutofixWrapper(originalRule) : null;

  return [
    {
      files: [GLOB_TS],
      rules: {
        'ts/promise-function-async': ['error', { allowedPromiseNames: ['ReactNode'] }],
      },
    },
    {
      /*
       * React 19 widens ReactNode to include Promise<AwaitedReactNode>. Any
       * function returning ReactNode (or its inferred expanded union) triggers
       * promise-function-async. The original rule is disabled; a no-autofix
       * variant warns without inserting async.
       */
      files: [GLOB_TSX],
      ...(noAutofixRule && {
        plugins: {
          'ts-no-autofix': { rules: { 'promise-function-async': noAutofixRule } },
        },
      }),
      rules: {
        'ts/promise-function-async': 'off',
        ...(noAutofixRule && {
          'ts-no-autofix/promise-function-async': 'warn',
        }),
      },
    },
  ];
}
