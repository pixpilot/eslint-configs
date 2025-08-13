import type { UserConfig } from '../types';
import { GLOB_TS, GLOB_TSX } from '@pixpilot/antfu-eslint-config';

export const tsOverrideRules: UserConfig = {
  files: [GLOB_TS, GLOB_TSX],
  rules: {
    'ts/default-param-last': ['error'],
    'ts/no-empty-function': [
      'error',
      {
        allow: ['constructors', 'arrowFunctions'],
      },
    ],
    'ts/no-invalid-this': 'off',
    'ts/no-loop-func': 'error',
    'ts/no-shadow': 'error',
    'ts/explicit-function-return-type': 'off',
    'ts/explicit-module-boundary-types': 'error', // Enable for TS files, will be disabled for TSX files specifically
  },
};

export const tsxOverrideRules: UserConfig = {
  files: [GLOB_TSX],
  rules: {
    'ts/explicit-module-boundary-types': 'off',
  },
};
