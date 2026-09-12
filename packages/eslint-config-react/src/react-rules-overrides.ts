/**
 * React rule overrides for `@eslint-react/eslint-plugin` v5.
 *
 * The previous version of this file carried a large set of rule names from the
 * legacy `eslint-plugin-react`. Those rules do not exist in
 * `@eslint-react/eslint-plugin`, and ESLint throws on unknown rule keys, so
 * they have been removed. Most of them were either already `'off'` or were
 * formatting rules now covered by the `style/*` (stylistic) and Prettier
 * configs.
 *
 * Hook rules (`rules-of-hooks`, `exhaustive-deps`) are provided by
 * `@eslint-react` itself; `eslint-plugin-react-hooks` is no longer required.
 */
import type { Rules } from '@pixpilot/eslint-config';

export const reactRulesOverride: Rules = {
  // Specify whether double or single quotes should be used in JSX attributes
  'style/jsx-quotes': ['error', 'prefer-double'],

  // Prevent direct mutation of this.state
  'react/no-direct-mutation-state': 'off',

  // Prevent usage of Array index in keys
  'react/no-array-index-key': 'error',

  // Prevent unused state values
  'react/no-unused-state': 'error',
};
export default reactRulesOverride;
