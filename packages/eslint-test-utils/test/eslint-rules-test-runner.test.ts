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
          code: 'const buf = new Buffer("test");',
          filePath: 'test.js',
          description: 'should detect deprecated Buffer usage',
          shouldFailRuleName: 'unicorn/no-new-buffer',
          options: {
            unicorn: true,
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
          code: 'const buf = new Buffer("test");',
          filePath: 'test.js',
          description: 'should handle string array rule checker',
          shouldFailRuleName: 'unicorn/no-new-buffer',
          options: {
            unicorn: true,
          },
        },
        {
          code: 'const test = "example";',
          filePath: 'test.js',
          description: 'should handle function rule checker',
          shouldFailRuleName: 'custom/my-rule',
          options: {
            custom: true,
          },
        },
        {
          code: 'import unused from "module";',
          filePath: 'test.js',
          description: 'should validate with rule mappings',
          shouldFailRuleName: 'some-import-rule/no-unused',
          options: {
            imports: true,
          },
        },
      ];

      beforeEach(() => {
        // Set up different responses based on the test scenario
        mockESLintInstance.lintText.mockImplementation(async (code: string) => {
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
          code: 'const valid = "code";',
          filePath: 'test.js',
          description: 'should handle lenient category with no errors',
          options: {
            lenient: true,
          },
        },
      ];

      eslintRulesTestRunner(lenientFixtures, mockConfigFunc);
    });

    describe('with duplicate categories', () => {
      const mockConfigFunc = vi.fn().mockResolvedValue([{}]);

      beforeEach(() => {
        mockESLintInstance.lintText.mockImplementation(async (code: string) => {
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
          code: 'const buf1 = new Buffer("test1");',
          filePath: 'test1.js',
          description: 'first unicorn test',
          shouldFailRuleName: 'unicorn/no-new-buffer',
          options: {
            unicorn: true,
          },
        },
        {
          code: 'const buf2 = new Buffer("test2");',
          filePath: 'test2.js',
          description: 'second unicorn test',
          shouldFailRuleName: 'unicorn/no-new-buffer',
          options: {
            unicorn: true,
          },
        },
        {
          code: 'import fs from "fs";',
          filePath: 'test3.js',
          description: 'imports test',
          shouldFailRuleName: 'unused-imports/no-unused-imports',
          options: {
            imports: true,
          },
        },
      ];

      eslintRulesTestRunner(duplicateFixtures, mockConfigFunc);
    });
  });
});
