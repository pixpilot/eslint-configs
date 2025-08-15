import type { TestFixture } from '@pixpilot/eslint-test-utils';
import { eslintRulesTestRunner } from '@pixpilot/eslint-test-utils';
import { describe } from 'vitest';
import defineConfig from '../src/config';

async function createTypedConfig(options: Partial<Record<string, boolean>>) {
  return defineConfig(options);
}

export function foo(): void {
  const res = createTypedConfig({});
  console.log(res);
}

// Test fixture for a Next.js rule
const nextjsRuleFixture: TestFixture = {
  code: `<img src="/test.jpg" alt="test" />`, // This should trigger next/no-img-element
  filePath: 'Component.jsx',
  description: 'should report Next.js rule errors for using img instead of next/image',
  shouldFailRuleName: 'next/no-img-element',
  options: {
    nextjs: true, // Ensure Next.js rules are applied
  },
};

describe('eslint-config-next', () => {
  eslintRulesTestRunner([nextjsRuleFixture], createTypedConfig);
});
