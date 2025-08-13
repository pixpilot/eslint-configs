import type { UserConfig } from '../types';
import { GLOB_TESTS } from '@pixpilot/antfu-eslint-config';

export const testOverrideRules: UserConfig = {
  files: [
    ...GLOB_TESTS,
    '**/test/**/*',
    '**/tests/**/*',
    '**/*.test.*',
    '**/__tests__/**/*',
    '__mocks__/**/*',
    '__mock__/**/*',
  ],
  rules: {
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-argument': 'off',
    'ts/strict-boolean-expressions': 'off',
    'ts/no-unsafe-return': 'off',
    'no-console': 'off',
    'prefer-const': 'off',
    'ts/no-unsafe-call': 'off',
    'import/no-extraneous-dependencies': 'off',
    'ts/typedef': 'off',
    'ts/no-explicit-any': 'off',
    'ts/ban-ts-comment': 'off',
    'no-magic-numbers': 'off',
    'no-await-in-loop': 'off',
    'ts/unbound-method': 'off',
    'no-underscore-dangle': 'off',
    'ts/explicit-module-boundary-types': 'off',
    'ts/no-unsafe-declaration-merging': 'off',
  },
};
