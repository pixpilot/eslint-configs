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

  const baseConfig = config(
    mergeOptions(options, userOptions || {}),
    ...userConfigs,
    ...mergedUserConfigs,
  );

  // Create React-specific rule overrides by extending base rules

  // Append the React-specific overrides to ensure they take precedence
  return baseConfig;
}

export default defineConfig;
