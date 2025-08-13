import type { TestFixture } from '@pixpilot/eslint-test-utils';
import type { ConfigOptions } from '../src/types';
import { eslintRulesTestRunner } from '@pixpilot/eslint-test-utils';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import configFunc from '../src/config';

describe('configFunc', () => {
  it('should return a config object when called', async () => {
    const result = configFunc({});
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    // Should be a promise-like object
    expect(typeof result.then).toBe('function');

    // Should resolve to an array of configs
    const resolved = await result;
    expect(Array.isArray(resolved)).toBe(true);
    expect(resolved.length).toBeGreaterThan(0);
  });

  it('should accept user options', async () => {
    const userOptions: ConfigOptions = {
      jsonc: false,
      unicorn: false,
    };
    const result = configFunc(userOptions);
    expect(result).toBeDefined();

    const resolved = await result;

    expect(Array.isArray(resolved)).toBe(true);
  });
});

describe('configFunc (integration tests for all rule categories)', () => {
  // Test fixtures for different rule categories
  const testFixtures: TestFixture<ConfigOptions>[] = [
    {
      code: `const buf = new Buffer('hello');`,
      filePath: 'test.js',
      description: 'should report unicorn rule errors for deprecated Buffer constructor',
      shouldFailRuleName: 'unicorn/no-new-buffer',
      options: {
        unicorn: true,
      },
    },
    {
      code: `import fs from 'fs';\nimport path from 'path';\nconsole.log('unused imports');`,
      filePath: 'test.js',
      description: 'should report import rule errors for unused imports',
      shouldFailRuleName: 'unused-imports/no-unused-imports',
      options: {
        imports: true,
      },
    },
    {
      code: `const regex = /[a-zA-Z0-9]/; // Could be simplified`,
      filePath: 'test.js',
      description: 'should report regexp rule errors for non-optimized regex patterns',
      shouldFailRuleName: 'regexp/use-ignore-case',
      options: {
        regexp: true,
      },
    },
    {
      code: `{
      "name": "test",
      "version": "1.0.0",
      "name": "duplicate"
    }`,
      filePath: 'test.json',
      description: 'should report JSONC rule errors for duplicate keys',
      shouldFailRuleName: 'jsonc/no-dupe-keys',
      options: {
        jsonc: true,
      },
    },
    {
      code: `---
    items:
      -
      - value`,
      filePath: 'test.yaml',
      description: 'should report YAML rule errors for empty sequence entries',
      shouldFailRuleName: 'yaml/no-empty-sequence-entry',
      options: {
        yaml: true,
      },
    },
    {
      code: `# Test Markdown

\`\`\`javascript
var x = 1;
console.log('test');
\`\`\``,
      filePath: 'test.md',
      description: 'should report rule errors in markdown code blocks',
      shouldFailRuleName: 'no-var',
      options: {
        markdown: true,
      },
    },
    {
      code: `function bitwiseTest() {
            return 1 & 2;
          }`,
      filePath: 'test.js',
      description: 'should report error for bitwise operator usage (no-bitwise)',
      shouldFailRuleName: 'no-bitwise',
      options: {
        unicorn: true,
      },
    },
    {
      code: `var x = function () { return { y: 1 };}(); // unwrapped IIFE`,
      filePath: 'test.js',
      description: 'should report stylistic rule errors for unwrapped IIFE',
      shouldFailRuleName: 'style/wrap-iife',

      options: {
        // This test should fail if prettier is enabled
        // because it disables the style/wrap-iife rule
        prettier: false,
        stylistic: true,
      },
    },
    {
      code: `var x = function () { return { y: 1 };}(); // unwrapped IIFE`,
      filePath: 'test.js',
      description:
        'should not report stylistic rule errors for unwrapped IIFE when prettier is enabled',
      shouldNotFailRuleName: 'style/wrap-iife', // This rule should NOT be found when prettier is enabled

      options: {
        prettier: true,
        stylistic: true,
      },
    },
    {
      code: `export function foo(x) { return x; }`,
      filePath: 'test.ts',
      description:
        'should report error for missing explicit module boundary types in TS file',
      shouldFailRuleName: 'ts/explicit-module-boundary-types',
      options: {
        typescript: { tsconfigPath: '' }, // Ensure TS rules are applied
      },
    },
    {
      code: `export function Bar(props) { return <div>{props.children}</div>; }`,
      filePath: 'test.tsx',
      description:
        'should NOT report error for missing explicit module boundary types in TSX file (rule is off)',
      shouldNotFailRuleName: 'ts/explicit-module-boundary-types',
      options: {
        typescript: { tsconfigPath: '' },
      },
    },
    {
      code: `console.log('testing');`,
      filePath: 'foo.test.ts',
      description:
        'should not report no-console error in test files when test.relaxed is enabled',
      shouldNotFailRuleName: 'no-console',
      options: {
        test: { relaxed: true },
        typescript: { tsconfigPath: '' },
      },
    },
    {
      code: `console.log('testing');`,
      filePath: '__tests__/bar.ts',
      description:
        'should not report no-console error in __tests__ folder files when test.relaxed is enabled',
      shouldNotFailRuleName: 'no-console',
      options: {
        test: { relaxed: true },
        typescript: { tsconfigPath: '' },
      },
    },
    {
      code: `console.log('testing');`,
      filePath: 'test/foo/bar.ts',
      description:
        'should not report no-console error in test folder files when test.relaxed is enabled',
      shouldNotFailRuleName: 'no-console',
      options: {
        test: { relaxed: true },
        typescript: { tsconfigPath: '' }, // Ensure TS rules are applied
      },
    },
    {
      code: `console.log('testing');`,
      filePath: 'bar.ts',
      description:
        'should report no-console error in NONE test folder files when test.relaxed is enabled',
      shouldFailRuleName: 'no-console',
      options: {
        test: { relaxed: true },
        typescript: { tsconfigPath: '' },
      },
    },
    {
      code: `console.log('testing');`,
      filePath: 'foo.test.ts',
      description:
        'should report no-console error in test files when test.relaxed is disabled',
      shouldFailRuleName: 'no-console',
      options: {
        test: { relaxed: false },
        typescript: { tsconfigPath: '' },
      },
    },
  ];

  // Helper function to create a typed config function wrapper
  async function createTypedConfig(options: ConfigOptions = {}) {
    // Enable all categories by default
    const categoryOverrides = {
      unicorn: false,
      imports: false,
      regexp: false,
      jsonc: false,
      yaml: false,
      markdown: false,
      stylistic: false,
      ...options,
    };

    return configFunc(categoryOverrides);
  }

  // Use the generic test runner
  eslintRulesTestRunner(testFixtures, createTypedConfig);

  it('should work with multiple rule categories enabled', async () => {
    const configResult = await createTypedConfig({
      unicorn: true,
      imports: true,
      regexp: true,
    });

    // Test code that should trigger multiple rule categories
    const code = `
  import fs from 'fs';
  const buf = new Buffer('hello');
  const regex = /[a-zA-Z0-9]/;
  console.log('test');
  `;

    try {
      // Filter out any conflicting "test" plugins to avoid duplication errors
      const sanitizedConfig = Array.isArray(configResult)
        ? configResult.map((config) => {
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
        : configResult;

      const eslint = new ESLint({
        overrideConfig: sanitizedConfig,
      });

      const results = await eslint.lintText(code, {
        filePath: 'test.js',
      });

      const allErrors = results[0]?.messages || [];

      // Should have errors from multiple categories
      const unicornErrors = allErrors.filter((m) => m.ruleId?.startsWith('unicorn/'));
      const importErrors = allErrors.filter(
        (m) => m.ruleId?.includes('import') || m.ruleId?.includes('unused'),
      );

      expect(unicornErrors.length).toBeGreaterThan(0);
      expect(importErrors.length).toBeGreaterThan(0);

      console.warn(
        'All errors found:',
        allErrors.map((e) => e.ruleId),
      );
    } catch (error) {
      console.error('ESLint error for multiple categories:', error);
      throw error;
    }
  });
});
