import type { UserConfig } from '../types';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * Prettier compatibility config for flat ESLint config.
 * See: https://github.com/prettier/eslint-config-prettier/blob/main/index.js
 */
export const prettierConfig: UserConfig = {
  ...eslintConfigPrettier,
  rules: {
    ...eslintConfigPrettier.rules,
    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
    'antfu/indent-unindent': 'off',
    'antfu/consistent-list-newline': 'off',
  },
};
