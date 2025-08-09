import { eslintRulesTestRunner } from '@pixpilot/eslint-test-utils';
import { describe } from 'vitest';
import configFunc from '../src/config';

// Async wrapper to match expected signature
async function createTypedConfig(options: Partial<Record<string, boolean>>) {
  return configFunc(options);
}

// Test fixture for a React rule
const reactRuleFixture = {
  category: 'react',
  code: `<div className="test" className="duplicate">Test</div>`, // This should trigger react/jsx-no-duplicate-props
  filePath: 'Component.jsx',
  expectedRule: 'react/jsx-no-duplicate-props',
  description: 'should report react rule errors for duplicate JSX props',
  categoryConfig: {
    ruleChecker: ['react/'],
  },
};

// Test fixture for React Hooks rules
const reactHooksRuleFixture = {
  category: 'react',
  code: `import React from 'react';
function Component() {
  if (Math.random() > 0.5) {
    const [state, setState] = React.useState(0); // This should trigger react-hooks/rules-of-hooks
  }
  return <div>Test</div>;
}
export default Component;`,
  filePath: 'Component.jsx',
  expectedRule: 'react-hooks/rules-of-hooks',
  description: 'should report react-hooks rule errors for hooks called conditionally',
  categoryConfig: {
    ruleChecker: ['react-hooks/'],
    ruleMappings: ['react-hooks', 'react'],
  },
};

// Test fixture for React Refresh rules
const reactRefreshRuleFixture = {
  category: 'react',
  code: `function MyComponent() {
  return <div>Test</div>;
}

export const notAComponent = 42;
export default MyComponent;`, // This should trigger react-refresh/only-export-components due to mixed exports
  filePath: 'Component.jsx',
  expectedRule: 'react-refresh/only-export-components',
  description:
    'should report react-refresh rule errors for mixing component and non-component exports',
  categoryConfig: {
    ruleChecker: ['react-refresh/'],
    ruleMappings: ['react-refresh', 'react'],
  },
};

// Test fixture for JSX A11y rules
const jsxA11yRuleFixture = {
  category: 'react',
  code: `<img src="/test.jpg" />`, // This should trigger jsx-a11y/alt-text
  filePath: 'Component.jsx',
  expectedRule: 'jsx-a11y/alt-text',
  description: 'should report jsx-a11y rule errors for missing alt text on images',
  categoryConfig: {
    ruleChecker: ['jsx-a11y/'],
    ruleMappings: ['jsx-a11y', 'a11y', 'accessibility'],
  },
};

describe('eslint-config-react', () => {
  eslintRulesTestRunner(
    [
      reactRuleFixture,
      reactHooksRuleFixture,
      reactRefreshRuleFixture,
      jsxA11yRuleFixture,
    ],
    createTypedConfig,
  );
});
