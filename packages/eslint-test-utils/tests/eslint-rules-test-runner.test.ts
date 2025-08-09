import type { TestFixture } from '../src/eslint-rules-test-runner';

import { ESLint } from 'eslint';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { eslintRulesTestRunner } from '../src/eslint-rules-test-runner';

// Mock ESLint
vi.mock('eslint', () => ({
  ESLint: vi.fn(),
}));

describe('eslintRulesTestRunner', () => {
  const mockESLintInstance = {
    lintText: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (ESLint as any).mockImplementation(() => mockESLintInstance);
  });

  it('should be defined', () => {
    expect(eslintRulesTestRunner).toBeDefined();
    expect(typeof eslintRulesTestRunner).toBe('function');
  });

  describe('integration tests', () => {
    describe('with unicorn rules', () => {
      const mockConfigFunc = vi.fn().mockResolvedValue([
        {
          rules: {
            'unicorn/no-new-buffer': 'error',
          },
        },
      ]);

      beforeEach(() => {
        mockESLintInstance.lintText.mockResolvedValue([
          {
            messages: [
              {
                ruleId: 'unicorn/no-new-buffer',
                message: 'Use Buffer.from() instead of new Buffer()',
                severity: 2,
              },
            ],
          },
        ]);
      });

      const unicornFixtures: TestFixture[] = [
        {
          category: 'unicorn',
          code: 'const buf = new Buffer("test");',
          filePath: 'test.js',
          expectedRule: 'unicorn/no-new-buffer',
          description: 'should detect deprecated Buffer usage',
          categoryConfig: {
            ruleChecker: ['unicorn/'],
          },
        },
      ];

      // This demonstrates the main use case - calling the function in a describe block
      eslintRulesTestRunner(unicornFixtures, mockConfigFunc);
    });

    describe('with multiple rule types', () => {
      const mockConfigFunc = vi.fn().mockResolvedValue([
        {
          rules: {
            'unicorn/no-new-buffer': 'error',
            'unused-imports/no-unused-imports': 'error',
            'custom/my-rule': 'error',
          },
        },
      ]);

      const mixedFixtures: TestFixture[] = [
        {
          category: 'unicorn',
          code: 'const buf = new Buffer("test");',
          filePath: 'test.js',
          expectedRule: 'unicorn/no-new-buffer',
          description: 'should handle string array rule checker',
          categoryConfig: {
            ruleChecker: ['unicorn/', 'another-prefix/'],
          },
        },
        {
          category: 'custom',
          code: 'const test = "example";',
          filePath: 'test.js',
          expectedRule: 'custom/my-rule',
          description: 'should handle function rule checker',
          categoryConfig: {
            ruleChecker: (ruleId: string) => ruleId.startsWith('custom/'),
          },
        },
        {
          category: 'imports',
          code: 'import unused from "module";',
          filePath: 'test.js',
          expectedRule: 'some-import-rule/no-unused',
          description: 'should validate with rule mappings',
          categoryConfig: {
            ruleChecker: (ruleId: string) => ruleId.includes('import'),
            ruleMappings: ['import', 'unused'],
          },
        },
      ];

      beforeEach(() => {
        // Set up different responses based on the test scenario
        mockESLintInstance.lintText.mockImplementation((code: string) => {
          if (code.includes('Buffer')) {
            return Promise.resolve([
              {
                messages: [
                  {
                    ruleId: 'unicorn/no-new-buffer',
                    message: 'Use Buffer.from() instead of new Buffer()',
                    severity: 2,
                  },
                ],
              },
            ]);
          }
          if (code.includes('import unused')) {
            return Promise.resolve([
              {
                messages: [
                  {
                    ruleId: 'some-import-rule/no-unused',
                    message: 'Import rule violation',
                    severity: 2,
                  },
                ],
              },
            ]);
          }
          // For custom rules
          return Promise.resolve([
            {
              messages: [
                {
                  ruleId: 'custom/my-rule',
                  message: 'Custom rule violation',
                  severity: 2,
                },
              ],
            },
          ]);
        });
      });

      eslintRulesTestRunner(mixedFixtures, mockConfigFunc);
    });

    describe('with lenient categories', () => {
      const mockConfigFunc = vi.fn().mockResolvedValue([{}]);

      beforeEach(() => {
        // Mock no ESLint errors
        mockESLintInstance.lintText.mockResolvedValue([
          {
            messages: [],
          },
        ]);
      });

      const lenientFixtures: TestFixture[] = [
        {
          category: 'lenient',
          code: 'const valid = "code";',
          filePath: 'test.js',
          expectedRule: 'lenient/some-rule',
          description: 'should handle lenient category with no errors',
          categoryConfig: {
            ruleChecker: ['lenient/'],
            isLenient: true,
          },
        },
      ];

      eslintRulesTestRunner(lenientFixtures, mockConfigFunc);
    });

    describe('with duplicate categories', () => {
      const mockConfigFunc = vi.fn().mockResolvedValue([{}]);

      beforeEach(() => {
        mockESLintInstance.lintText.mockImplementation((code: string) => {
          if (code.includes('Buffer')) {
            return Promise.resolve([
              {
                messages: [
                  {
                    ruleId: 'unicorn/no-new-buffer',
                    message: 'Use Buffer.from() instead of new Buffer()',
                    severity: 2,
                  },
                ],
              },
            ]);
          }
          if (code.includes('import fs')) {
            return Promise.resolve([
              {
                messages: [
                  {
                    ruleId: 'unused-imports/no-unused-imports',
                    message: 'Unused import',
                    severity: 2,
                  },
                ],
              },
            ]);
          }
          return Promise.resolve([{ messages: [] }]);
        });
      });

      const duplicateFixtures: TestFixture[] = [
        {
          category: 'unicorn',
          code: 'const buf1 = new Buffer("test1");',
          filePath: 'test1.js',
          expectedRule: 'unicorn/no-new-buffer',
          description: 'first unicorn test',
          categoryConfig: { ruleChecker: ['unicorn/'] },
        },
        {
          category: 'unicorn',
          code: 'const buf2 = new Buffer("test2");',
          filePath: 'test2.js',
          expectedRule: 'unicorn/no-new-buffer',
          description: 'second unicorn test',
          categoryConfig: { ruleChecker: ['unicorn/'] },
        },
        {
          category: 'imports',
          code: 'import fs from "fs";',
          filePath: 'test3.js',
          expectedRule: 'unused-imports/no-unused-imports',
          description: 'imports test',
          categoryConfig: { ruleChecker: ['unused-imports/'] },
        },
      ];

      eslintRulesTestRunner(duplicateFixtures, mockConfigFunc);
    });
  });
});
