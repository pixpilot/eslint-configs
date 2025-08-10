import type { TestFixture } from '@pixpilot/eslint-test-utils';
import { eslintRulesTestRunner } from '@pixpilot/eslint-test-utils';
import { describe } from 'vitest';
import configFunc from '../src/config';

// Async wrapper to match expected signature
function createTypedConfig(options: Partial<Record<string, boolean>>) {
  return configFunc(options);
}

const reactRuleFixture: TestFixture[] = [
  {
    category: 'react',
    code: `<div className="foo" className="bar">Duplicate</div>`, // This should trigger react/jsx-no-duplicate-props
    filePath: 'Component.jsx',
    description: 'should report react rule errors for duplicate className props',
    shouldFailRuleName: 'react/jsx-no-duplicate-props', // Clear and simple!
  },
  {
    category: 'react',
    code: `<div name="foo" className="bar">Duplicate</div>`, // This should NOT trigger react/jsx-no-duplicate-props
    filePath: 'Component.jsx',
    description: 'should NOT report react rule errors for different prop names',
    shouldNotFailRuleName: 'react/jsx-no-duplicate-props', // This rule should NOT be found
  },
  {
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
    description: 'should report react-hooks rule errors for hooks called conditionally',
    shouldFailRuleName: 'react-hooks/rules-of-hooks',
  },
  {
    category: 'react',
    code: `const _privateVar = 'test'; // This should trigger no-underscore-dangle`,
    filePath: 'Component.jsx',
    description: 'should report no-underscore-dangle for underscore variables',
    shouldFailRuleName: 'no-underscore-dangle',
  },
];

// Test specifically for no-underscore-dangle rule configuration
const noUnderscoreDangleFixture: TestFixture[] = [
  {
    category: 'react',
    code: `const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = 'allowed'; // This should NOT trigger no-underscore-dangle`,
    filePath: 'Component.jsx',
    description:
      'should NOT report no-underscore-dangle for Redux DevTools extension variable (exception test)',
    shouldNotFailRuleName: 'no-underscore-dangle', // This rule should NOT trigger for Redux DevTools
  },
];

const a11yRuleFixture: TestFixture[] = [
  {
    category: 'react',
    code: `<img src="/test.jpg" />`, // This should trigger jsx-a11y/alt-text
    filePath: 'Component.jsx',
    description: 'should report jsx-a11y rule errors for missing alt text on images',
    shouldFailRuleName: 'jsx-a11y/alt-text',
  },
  {
    category: 'react',
    code: `<div role="checkbox"></div>`, // This should trigger jsx-a11y/role-has-required-aria-props
    filePath: 'Component.jsx',
    description:
      'should report jsx-a11y rule errors for missing required aria props for a role',
    shouldFailRuleName: 'jsx-a11y/role-has-required-aria-props',
  },
  {
    category: 'react',
    code: `<video src="/test.mp4"></video>`, // This should trigger jsx-a11y/media-has-caption
    filePath: 'Component.jsx',
    description: 'should report jsx-a11y rule errors for media elements missing captions',
    shouldFailRuleName: 'jsx-a11y/media-has-caption',
  },
];

const anchorHasContentFixture: TestFixture[] = [
  {
    category: 'react',
    code: `<a></a>`, // This should trigger jsx-a11y/anchor-has-content
    filePath: 'Component.jsx',
    description: 'should report jsx-a11y/anchor-has-content rule for empty anchor',
    shouldFailRuleName: 'jsx-a11y/anchor-has-content', // Simple: this rule should be found
  },
  // Example of testing that a rule is properly disabled:
  // {
  //   category: 'react',
  //   code: `<a></a>`, // This should NOT trigger jsx-a11y/anchor-has-content when disabled
  //   filePath: 'Component.jsx',
  //   description: 'should NOT report jsx-a11y/anchor-has-content when rule is disabled',
  //   shouldNotFailRuleName: 'jsx-a11y/anchor-has-content', // Simple: this rule should NOT be found

  // },
];

describe('eslint-config-react', () => {
  eslintRulesTestRunner(
    [
      ...reactRuleFixture,
      ...noUnderscoreDangleFixture,
      ...a11yRuleFixture,
      ...anchorHasContentFixture,
    ],
    createTypedConfig,
  );
});
