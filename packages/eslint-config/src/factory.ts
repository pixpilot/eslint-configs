import type { Awaitable } from 'eslint-flat-config-utils';

import type {
  ConfigFuncType,
  ConfigOptions,
  ReturnTypeOfConfigFunc,
  TypedFlatConfigItem,
  UserConfigs,
} from './types';
// Use require to import process to avoid using the global variable directly
import config from '@pixpilot/antfu-eslint-config';
import { isPackageExists } from 'local-pkg';
import {
  drizzleConfigs,
  javascriptConfigs,
  jsoncConfigs,
  jsxConfigs,
  prettierConfigs,
  promiseConfigs,
  testConfigs,
  tsxConfigs,
  turboConfigs,
  typescriptConfigs,
} from './rules';
import { resolveOptions } from './utils/resolve-options';

// eslint-disable-next-line ts/promise-function-async
export function defineConfig(
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
  const { drizzle, prettier, test, ...antfuEslintOptions } = mergedOptions;

  /*
   * Enable the Drizzle rules when explicitly requested, otherwise fall back to
   * detecting `drizzle-orm` in the consuming project.
   */
  const enableDrizzle = drizzle ?? isPackageExists('drizzle-orm');

  const mergedUserConfigs: Awaitable<TypedFlatConfigItem[]>[] = [];

  // Add JS override rules
  mergedUserConfigs.push(javascriptConfigs());

  mergedUserConfigs.push(jsxConfigs());

  if (mergedOptions.jsonc === true) {
    // Allow JSONC-specific syntax without relaxing strict JSON files.
    mergedUserConfigs.push(jsoncConfigs());
  }

  if (mergedOptions.typescript !== undefined && mergedOptions.typescript !== false) {
    // Add TS override rules
    mergedUserConfigs.push(typescriptConfigs());
    // Add TSX override rules
    mergedUserConfigs.push(tsxConfigs());

    /*
     * ts/promise-function-async is type-aware and requires a tsconfig path to
     * operate. Only add the override when type-aware linting is configured.
     */
    const tsOptions = mergedOptions.typescript;
    const isTypeAware =
      typeof tsOptions === 'object' &&
      'tsconfigPath' in tsOptions &&
      Boolean(tsOptions.tsconfigPath);
    if (isTypeAware) {
      mergedUserConfigs.push(promiseConfigs());
    }
  }

  if (test) {
    if (test.relaxed === true) {
      // Relaxed test rules
      mergedUserConfigs.push(testConfigs());
    }
  }

  if (mergedOptions.prettier) {
    mergedUserConfigs.push(prettierConfigs());
  }

  if (mergedOptions.turbo) {
    mergedUserConfigs.push(turboConfigs());
  }

  if (enableDrizzle !== false) {
    mergedUserConfigs.push(drizzleConfigs(enableDrizzle === true ? {} : enableDrizzle));
  }

  /*
   * The Drizzle rules ship as their own package here, so older versions of the
   * upstream config must not register the `drizzle` plugin as well (ESLint
   * rejects a plugin name being defined twice). Safe to drop once this depends
   * on a `@pixpilot/antfu-eslint-config` that no longer ships drizzle.
   */
  const upstreamOptions = {
    ...antfuEslintOptions,
    drizzle: false,
  } as typeof antfuEslintOptions;

  const configurations = config(upstreamOptions, ...mergedUserConfigs, ...userConfigs);

  return configurations;
}

export default defineConfig;

export type { ConfigFuncType, ConfigOptions };
