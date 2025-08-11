import type { ConfigFuncType, ConfigOptions } from './types';

import config from '@pixpilot/antfu-eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import { overrideRules } from './override-rules';
import { mergeOptions } from './utils';

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    jsonc: true,
    yaml: true,
    gitignore: true,
    unicorn: true,
    imports: true,
    markdown: true,
    regexp: true,
    autoRenamePlugins: true,
    prettier: true,
    stylistic: true,
    rules: {
      'ts/explicit-function-return-type': 'off',
      'ts/explicit-module-boundary-types': 'error',
      ...overrideRules,
    },
  };

  const mergedOptions = mergeOptions(options, op || {}) as ConfigOptions;
  const { prettier, ...antfuEslintOptions } = mergedOptions;

  const configurations = config(
    antfuEslintOptions,
    {
      files: ['**/*.tsx'],
      rules: {
        // Add override for TSX files to turn off 'ts/explicit-module-boundary-types'
        'ts/explicit-module-boundary-types': 'off',
      },
    },
    ...rest,
  );

  if (mergedOptions.prettier) {
    configurations.append([
      {
        // This enables Prettier compatibility for flat config
        // See: https://github.com/prettier/eslint-config-prettier/blob/main/index.js
        ...eslintConfigPrettier,
        rules: {
          ...eslintConfigPrettier.rules,
          'antfu/if-newline': 'off',
          'antfu/curly': 'off',
          'antfu/indent-unindent': 'off',
          'antfu/consistent-list-newline': 'off',
        },
      } as any,
    ]);
  }

  return configurations;
};

export default configFunc;

export type { ConfigFuncType, ConfigOptions };
