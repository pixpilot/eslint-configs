import type {
  ConfigFuncType,
  ConfigOptions,
  ReturnTypeOfConfigFunc,
  TypedFlatConfigItem,
  UserConfigs,
} from './types';

// Use require to import process to avoid using the global variable directly
import config from '@pixpilot/antfu-eslint-config';
import {
  javascriptConfigs,
  prettierConfigs,
  testConfigs,
  tsxConfigs,
  turboConfigs,
  typescriptConfigs,
} from './rules';
import { resolveOptions } from './utils/resolve-options';

async function configFunc(
  options?: ConfigOptions,
  ...userConfigs: UserConfigs
): Promise<ReturnTypeOfConfigFunc> {
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

  const mergedUserConfigs: TypedFlatConfigItem[] = [];

  // Add JS override rules
  mergedUserConfigs.push(...(await javascriptConfigs()));

  if (mergedOptions.typescript !== undefined && mergedOptions.typescript !== false) {
    // Add TS override rules
    mergedUserConfigs.push(...(await typescriptConfigs()));
    // Add TSX override rules
    mergedUserConfigs.push(...(await tsxConfigs()));
  }

  if (test) {
    if (test.relaxed === true) {
      // Relaxed test rules
      mergedUserConfigs.push(...(await testConfigs()));
    }
  }

  if (mergedOptions.prettier) {
    mergedUserConfigs.push(...(await prettierConfigs()));
  }

  if (mergedOptions.turbo) {
    mergedUserConfigs.push(...(await turboConfigs()));
  }

  const configurations = config(antfuEslintOptions, ...mergedUserConfigs, ...userConfigs);

  return configurations;
}

export default configFunc;

export type { ConfigFuncType, ConfigOptions };
