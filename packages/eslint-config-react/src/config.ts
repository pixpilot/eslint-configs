import type {
  Awaitable,
  ConfigOptions,
  ReturnTypeOfConfigFunc,
  TypedFlatConfigItem,
  UserConfigs,
} from '@pixpilot/eslint-config';
import config, { mergeOptions } from '@pixpilot/eslint-config';
import jsxA11yRulesOverride from './jsx-a11y-overrides';
import reactRulesOverride from './react-rules-overrides';
import { jsConfigs } from './rules/javascript';

// eslint-disable-next-line ts/promise-function-async
export function defineConfig(
  userOptions?: ConfigOptions,
  ...userConfigs: UserConfigs
): ReturnTypeOfConfigFunc {
  const options: ConfigOptions = {
    react: {
      overrides: reactRulesOverride,
    },
    type: 'app',
    jsx: {
      a11y: {
        overrides: jsxA11yRulesOverride,
      },
    },
  };

  const mergedUserConfigs: Awaitable<TypedFlatConfigItem[]>[] = [];

  mergedUserConfigs.push(jsConfigs());

  const mergedOptions = mergeOptions(options, userOptions || {});

  const baseConfig = config(mergedOptions, ...userConfigs, ...mergedUserConfigs);

  // Create React-specific rule overrides by extending base rules

  /*
   * Upstream only enables `allowConstantExport` when Vite is installed, which
   * leaves the rule flagging constant exports in every other setup. Force it on
   * while keeping the framework-aware `allowExportNames` upstream computed
   * (Next.js `generateMetadata`, Remix `loader`, ...) — replacing the whole rule
   * entry would drop those and break those frameworks.
   */
  if (mergedOptions.react !== false) {
    return baseConfig.override('antfu/react/rules', (reactConfig) => {
      const existing = reactConfig.rules?.['react-refresh/only-export-components'];
      const existingOptions =
        Array.isArray(existing) && typeof existing[1] === 'object' && existing[1] !== null
          ? existing[1]
          : {};

      return {
        ...reactConfig,
        rules: {
          ...reactConfig.rules,
          'react-refresh/only-export-components': [
            'error',
            {
              ...existingOptions,
              allowConstantExport: true,
            },
          ],
        },
      };
    });
  }

  // Append the React-specific overrides to ensure they take precedence
  return baseConfig;
}

export default defineConfig;
