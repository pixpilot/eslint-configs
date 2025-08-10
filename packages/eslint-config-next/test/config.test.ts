import type { TestFixture } from '@pixpilot/eslint-test-utils';
import { eslintRulesTestRunner } from '@pixpilot/eslint-test-utils';
import { describe } from 'vitest';
import configFunc from '../src/config';

// Async wrapper to match expected signature
function createTypedConfig(options: Partial<Record<string, boolean>>) {
  return configFunc(options);
}

// Test fixture for a Next.js rule
const nextjsRuleFixture: TestFixture = {
  category: 'nextjs',
  code: `<img src="/test.jpg" alt="test" />`, // This should trigger next/no-img-element
  filePath: 'Component.jsx',
  description: 'should report Next.js rule errors for using img instead of next/image',
  shouldFailRuleName: 'next/no-img-element',
};

describe('eslint-config-next', () => {
  eslintRulesTestRunner([nextjsRuleFixture], createTypedConfig);
});
