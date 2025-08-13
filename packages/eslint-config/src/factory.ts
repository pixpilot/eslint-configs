import type {
  ConfigFuncType,
  ConfigOptions,
  TypedFlatConfigItem,
  UserConfig,
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
import { resolveOptions } from './utils/resolve-options';

// eslint-disable-next-line ts/promise-function-async
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
    test: {
      relaxed: true,
    },
  };

  // Use the new utility function to resolve options
  const mergedOptions = resolveOptions(options, op);
  const { prettier, test, ...antfuEslintOptions } = mergedOptions;

  const userConfigs: UserConfig[] = [];

  // Add JS override rules
  userConfigs.push(jsOverrideRules);

  // Add TS override rules
  userConfigs.push(tsOverrideRules);

  // Add specific TS rules for TSX files
  userConfigs.push(tsxOverrideRules);

  if (test) {
    if (test.relaxed === true) {
      // Relaxed test rules
      userConfigs.push(testOverrideRules);
    }
  }

  if (mergedOptions.prettier) {
    userConfigs.push(prettierConfig);
  }

  const configurations = config(
    antfuEslintOptions,
    ...(userConfigs as TypedFlatConfigItem[]),
    ...rest,
  );

  return configurations;
};

export default configFunc;

export type { ConfigFuncType, ConfigOptions };
