import { eslintRulesTestRunner } from '@pixpilot/eslint-test-utils';
import { describe } from 'vitest';
import configFunc from '../src/config';

// Async wrapper to match expected signature
async function createTypedConfig(options: Partial<Record<string, boolean>>) {
  return configFunc(options);
}

// Test fixture for a Next.js rule
const nextjsRuleFixture = {
  category: 'nextjs',
  code: `<img src="/test.jpg" alt="test" />`, // This should trigger next/no-img-element
  filePath: 'Component.jsx',
  expectedRule: 'next/no-img-element',
  description: 'should report Next.js rule errors for using img instead of next/image',
  categoryConfig: {
    ruleChecker: ['next/'],
    ruleMappings: ['next'], // Map to next for validation
  },
};

describe('eslint-config-next', () => {
  eslintRulesTestRunner([nextjsRuleFixture], createTypedConfig);
});
