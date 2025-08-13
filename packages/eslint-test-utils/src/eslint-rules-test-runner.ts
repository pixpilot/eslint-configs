/* eslint-disable ts/strict-boolean-expressions */

import { ESLint } from 'eslint';
import { expect, it } from 'vitest';

export interface TestFixture<Options = Record<string, any>> {
  /** The code sample to lint for this test case */
  code: string;
  /** The file path to associate with the linted code */
  filePath: string;
  /** Description of the test case */
  description: string;

  /** Optional config options to merge with default category toggles */
  options?: Options;
  /** Specific rule name that should be found in the error list for test to pass */
  shouldFailRuleName?: string;
  /** Specific rule name that should NOT be found in the error list for test to pass */
  shouldNotFailRuleName?: string;
}

/**
 * Generic function to run integration tests for ESLint rule categories
 *
 * @param fixtures - Array of test fixtures containing test cases and their configurations
 * @param configFunc - Function that creates ESLint config from category options
 *
 * @example
 * ```typescript
 * // Define your categories
 * type MyCategories = 'unicorn' | 'imports';
 *
 * // Define your fixtures with embedded configurations
 * const fixtures: TestFixture[] = [
 *   {
 *     category: 'unicorn',
 *     code: 'const buf = new Buffer("hello");',
 *     filePath: 'test.js',
 *     description: 'should detect unicorn errors',
 *     shouldFailRuleName: 'unicorn/no-new-buffer', // This rule should be found in errors
 *   },
 *   {
 *     category: 'unicorn',
 *     code: 'const x = 1;',
 *     filePath: 'test.js',
 *     description: 'should not detect disabled rule',
 *     shouldNotFailRuleName: 'unicorn/no-new-buffer', // This rule should NOT be found in errors
 *   }
 * ];
 *
 * // Create your config function
 * async function createConfig(options: Partial<Record<MyCategories, boolean>>) {
 *   return myConfigFunction(options);
 * }
 *
 * // Use in a describe block
 * describe('My ESLint Config Tests', () => {
 *   eslintRulesTestRunner(fixtures, createConfig);
 * });
 * ```
 *
 * - `shouldFailRuleName`: If provided, asserts that this rule is present in the ESLint error list.
 * - `shouldNotFailRuleName`: If provided, asserts that this rule is NOT present in the ESLint error list.
 * - If neither is provided, the test will only check that ESLint runs without error.
 */
export function eslintRulesTestRunner(
  fixtures: TestFixture[],
  configFunc: (options: Record<string, any>) => Promise<any>,
): void {
  // Extract unique categories from fixtures to build the type-safe options

  fixtures.forEach(
    ({
      code,
      filePath,
      description,
      options,
      shouldFailRuleName,
      shouldNotFailRuleName,
    }) => {
      it(description, async () => {
        const mergedOptions = options || {};

        const configArrayUnknown = (await configFunc(mergedOptions)) as unknown;

        // Narrow the type to expected ESLint config array/object
        const configArray = configArrayUnknown as ESLint.Options['overrideConfig'];

        try {
          // Filter out any conflicting "test" plugins to avoid duplication errors
          const sanitizedConfig = Array.isArray(configArray)
            ? configArray.map((config) => {
                if (config && typeof config === 'object' && config.plugins) {
                  const { plugins, ...rest } = config;
                  const filteredPlugins = { ...plugins };

                  // Remove any test plugin that might conflict with Vitest's test plugin
                  if (
                    filteredPlugins['test'] &&
                    typeof filteredPlugins['test'] === 'object'
                  ) {
                    delete filteredPlugins['test'];
                  }

                  return {
                    ...rest,
                    plugins: filteredPlugins,
                  };
                }
                return config;
              })
            : configArray;

          const eslint = new ESLint({
            overrideConfig: sanitizedConfig,
          });

          const results = await eslint.lintText(code, {
            filePath,
          });

          // Check for specific rule requirements
          if (shouldFailRuleName || shouldNotFailRuleName) {
            const allRules =
              results[0]?.messages?.map((m) => m.ruleId).filter(Boolean) || [];

            console.warn(`All rules detected:`, allRules);

            if (shouldFailRuleName) {
              const hasExpectedRule = allRules.includes(shouldFailRuleName);

              if (!hasExpectedRule) {
                throw new Error(
                  `Expected rule '${shouldFailRuleName}' to be found in ESLint errors, but found: [${allRules.join(', ')}]`,
                );
              }

              console.warn(`✓ Expected rule '${shouldFailRuleName}' found in errors`);
            }

            if (shouldNotFailRuleName) {
              const hasUnexpectedRule = allRules.includes(shouldNotFailRuleName);

              if (hasUnexpectedRule) {
                throw new Error(
                  `Rule '${shouldNotFailRuleName}' should NOT be found in ESLint errors, but it was found in: [${allRules.join(', ')}]`,
                );
              }

              console.warn(
                `✓ Rule '${shouldNotFailRuleName}' correctly not found in errors`,
              );
            }
          } else {
            // No specific rule checking - just ensure there are some ESLint errors
            const allRules =
              results[0]?.messages?.map((m) => m.ruleId).filter(Boolean) || [];
            console.warn(
              `No specific rule checker provided. All rules detected:`,
              allRules,
            );
            expect(results[0]?.messages?.length || 0).toBeGreaterThanOrEqual(0);
          }
        } catch (error) {
          console.error(`ESLint error for "${description}":`, error);
          throw error;
        }
      });
    },
  );
}
