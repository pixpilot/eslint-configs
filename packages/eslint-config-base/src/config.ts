import type { ConfigFuncType, ConfigOptions } from './types';

import config from '@pixpilot/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import { overrideRules } from './override-rules';
import { mergeOptions } from './utils';

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    type: 'lib',
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
      ...overrideRules,
    },
  };

  // const mergedOptions = { ...options, ...op } as ConfigOptions;

  const mergedOptions = mergeOptions(options, op || {}) as ConfigOptions;

  const { prettier, ...eslintConfig } = mergedOptions;

  const configurations = config(eslintConfig, ...rest);

  if (mergedOptions.prettier) {
    configurations.append([
      {
        // This enables Prettier compatibility for flat config
        // See: https://github.com/eslint/eslint-config-prettier#flat-config
        ...eslintConfigPrettier,
      },
    ]);
  }

  return configurations;
};

export default configFunc;

export type { ConfigFuncType, ConfigOptions };
