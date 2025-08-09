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
  /**
   * Comprehensive integration tests that verify all available rule categories work correctly.
   * These tests create specific code violations for each category and verify that the
   * corresponding ESLint rules detect them.
   *
   * Rule categories tested:
   * - unicorn: ESLint plugin for better JavaScript/TypeScript practices
   * - imports: Import/export related rules including unused imports
   * - regexp: Regular expression optimization and best practices
   * - jsonc: JSON with comments linting
   * - yaml: YAML file linting
   * - markdown: Markdown file linting (within code blocks)
   * - gitignore: Gitignore file linting
   */

  // Test fixtures for different rule categories
  const testFixtures: TestFixture[] = [
    {
      category: 'unicorn',
      code: `const buf = new Buffer('hello');`,
      filePath: 'test.js',
      expectedRule: 'unicorn/no-new-buffer',
      description: 'should report unicorn rule errors for deprecated Buffer constructor',
      categoryConfig: {
        ruleChecker: ['unicorn/'],
      },
    },
    {
      category: 'imports',
      code: `import fs from 'fs';\nimport path from 'path';\nconsole.log('unused imports');`,
      filePath: 'test.js',
      expectedRule: 'unused-imports/no-unused-imports',
      description: 'should report import rule errors for unused imports',
      categoryConfig: {
        ruleChecker: (ruleId: string) =>
          ruleId.includes('import') || ruleId.includes('unused-imports'),
        ruleMappings: ['import'],
      },
    },
    {
      category: 'regexp',
      code: `const regex = /[a-zA-Z0-9]/; // Could be simplified`,
      filePath: 'test.js',
      expectedRule: 'regexp/use-ignore-case',
      description: 'should report regexp rule errors for non-optimized regex patterns',
      categoryConfig: {
        ruleChecker: ['regexp/'],
      },
    },
    {
      category: 'jsonc',
      code: `{
  "name": "test",
  "version": "1.0.0",
  "name": "duplicate"
}`,
      filePath: 'test.json',
      expectedRule: 'jsonc/no-dupe-keys',
      description: 'should report JSONC rule errors for duplicate keys',
      categoryConfig: {
        ruleChecker: ['jsonc/'],
      },
    },
    {
      category: 'yaml',
      code: `---
name: test
version: 1.0.0
name: duplicate
invalid_yaml_syntax: [unclosed`,
      filePath: 'test.yaml',
      expectedRule: 'yml/no-duplicate-keys',
      description: 'should report YAML rule errors for duplicate keys and syntax issues',
      categoryConfig: {
        ruleChecker: ['yml/', 'yaml/'],
        isLenient: true,
        ruleMappings: ['yml'],
      },
    },
    {
      category: 'markdown',
      code: `# Title

\`\`\`
const x = 1;
console.log('missing language');
\`\`\`

[Invalid Link](`,
      filePath: 'test.md',
      expectedRule: 'markdown/fenced-code-language',
      description:
        'should report markdown rule errors for missing language in code blocks',
      categoryConfig: {
        ruleChecker: (ruleId: string) =>
          ruleId.startsWith('@eslint/markdown/') || ruleId.includes('markdown'),
        isLenient: true,
      },
    },
    {
      category: 'gitignore',
      code: `*.log
*.tmp
*.log
# Duplicate pattern above`,
      filePath: '.gitignore',
      expectedRule: 'gitignore/no-duplicate-patterns',
      description: 'should report gitignore rule errors for duplicate patterns',
      categoryConfig: {
        ruleChecker: ['gitignore/'],
        isLenient: true,
      },
    },
  ];

  // Define the available categories for type safety
  type ConfigCategory =
    | 'unicorn'
    | 'imports'
    | 'regexp'
    | 'jsonc'
    | 'yaml'
    | 'markdown'
    | 'gitignore';

  // Helper function to create a typed config function wrapper
  async function createTypedConfig(options: Partial<Record<ConfigCategory, boolean>>) {
    const fullOptions: ConfigOptions = {
      jsonc: false,
      yaml: false,
      gitignore: false,
      unicorn: false,
      imports: false,
      markdown: false,
      regexp: false,
      ...options,
    };
    return configFunc(fullOptions);
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
