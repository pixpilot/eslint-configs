import type {
  ConfigFuncType,
  ConfigOptions,
  ReturnTypeOfConfigFunc,
  TypedFlatConfigItem,
  UserConfigs,
  UserOption,
} from './types';

// Use require to import process to avoid using the global variable directly
import config from '@pixpilot/antfu-eslint-config';
import {
  jsOverrideRules,
  testOverrideRules,
  tsOverrideRules,
  tsxOverrideRules,
} from './rules';
import { prettierConfig } from './rules/prettier';
import { turboConfigs } from './rules/turbo';
import { resolveOptions } from './utils/resolve-options';

// eslint-disable-next-line ts/promise-function-async
function configFunc(
  options?: ConfigOptions,
  ...userConfigs: UserConfigs
): ReturnTypeOfConfigFunc {
  const defaultOptions: ConfigOptions = {
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
    test: {
      relaxed: true,
    },
  };

  // Use the new utility function to resolve options
  const mergedOptions = resolveOptions(defaultOptions, options || {});
  const { prettier, test, ...antfuEslintOptions } = mergedOptions;

  const mergedUserConfigs: UserOption[] = [];

  // Add JS override rules
  mergedUserConfigs.push(jsOverrideRules);

  if (mergedOptions.typescript !== undefined && mergedOptions.typescript !== false) {
    // Add TS override rules
    mergedUserConfigs.push(tsOverrideRules);

    // Add TSX override rules
    mergedUserConfigs.push(tsxOverrideRules);
  }

  if (test) {
    if (test.relaxed === true) {
      // Relaxed test rules
      mergedUserConfigs.push(testOverrideRules);
    }
  }

  if (mergedOptions.prettier) {
    mergedUserConfigs.push(prettierConfig);
  }

  if (mergedOptions.turbo) {
    mergedUserConfigs.push(turboConfigs);
  }

  const configurations = config(
    antfuEslintOptions,
    ...(mergedUserConfigs as TypedFlatConfigItem[]),
    ...userConfigs,
  );

  return configurations;
}

export default configFunc;

export type { ConfigFuncType, ConfigOptions };
