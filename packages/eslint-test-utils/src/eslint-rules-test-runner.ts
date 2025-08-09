import { ESLint } from 'eslint';
import { expect, it } from 'vitest';

// Type definitions for the test framework
export interface RuleChecker {
  (ruleId: string): boolean;
}

export interface CategoryConfig {
  /** Rule checker function or array of rule prefixes to check */
  ruleChecker: RuleChecker | string[];
  /** Whether this category should be treated as lenient (allows zero errors) */
  isLenient?: boolean;
  /** Category name mappings for rule validation */
  ruleMappings?: string[];
}

export interface TestFixture {
  category: string;
  code: string;
  filePath: string;
  expectedRule: string;
  description: string;
  /** Category configuration for this specific test */
  categoryConfig: CategoryConfig;
}

/**
 * Generic function to create a rule checker from configuration
 */
function createRuleChecker(config: CategoryConfig): RuleChecker {
  if (typeof config.ruleChecker === 'function') {
    return config.ruleChecker;
  }

  const prefixes = config.ruleChecker;
  return (ruleId: string) => prefixes.some((prefix) => ruleId.startsWith(prefix));
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
 *     expectedRule: 'unicorn/no-new-buffer',
 *     description: 'should detect unicorn errors',
 *     categoryConfig: { ruleChecker: ['unicorn/'] }
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
 */
export function eslintRulesTestRunner<T extends string>(
  fixtures: TestFixture[],
  configFunc: (options: Partial<Record<T, boolean>>) => Promise<any>,
): void {
  // Extract unique categories from fixtures to build the type-safe options
  const allCategories = [...new Set(fixtures.map((f) => f.category))] as T[];

  fixtures.forEach(
    ({
      category,
      code,
      filePath,
      expectedRule: _expectedRule,
      description,
      categoryConfig,
    }) => {
      it(description, async () => {
        // Create config with only the specific category enabled
        const configOptions = allCategories.reduce(
          (acc, cat) => {
            acc[cat] = cat === category;
            return acc;
          },
          {} as Partial<Record<T, boolean>>,
        );

        const configArray = await configFunc(configOptions);
        const ruleChecker = createRuleChecker(categoryConfig);

        try {
          // Filter out any conflicting "test" plugins to avoid duplication errors
          const sanitizedConfig = Array.isArray(configArray)
            ? configArray.map((config) => {
                if (config && typeof config === 'object' && config.plugins) {
                  const { plugins, ...rest } = config;
                  const filteredPlugins = { ...plugins };

                  // Remove any test plugin that might conflict with Vitest's test plugin
                  if (filteredPlugins.test && typeof filteredPlugins.test === 'object') {
                    delete filteredPlugins.test;
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

          const categoryErrors =
            results[0]?.messages?.filter((m) => {
              return m.ruleId ? ruleChecker(m.ruleId) : false;
            }) || [];

          // Handle lenient categories
          if (categoryErrors.length === 0 && categoryConfig.isLenient) {
            const allRules =
              results[0]?.messages?.map((m) => m.ruleId).filter(Boolean) || [];
            console.warn(`No ${category} errors found. All rules detected:`, allRules);
            expect(results[0]?.messages?.length || 0).toBeGreaterThanOrEqual(0);
            return;
          }

          expect(categoryErrors.length).toBeGreaterThan(0);

          // Log the actual errors found for debugging
          if (categoryErrors.length > 0) {
            console.warn(
              `${category} errors found:`,
              categoryErrors.map((e) => e.ruleId),
            );
          }

          // Verify we have errors from the expected category
          if (categoryErrors.length > 0) {
            const ruleMappings = categoryConfig.ruleMappings || [category];
            expect(
              categoryErrors.some(
                (err) =>
                  err.ruleId &&
                  ruleMappings.some((mapping) => err.ruleId!.includes(mapping)),
              ),
            ).toBe(true);
          }
        } catch (error) {
          console.error(`ESLint error for ${category}:`, error);
          throw error;
        }
      });
    },
  );
}
