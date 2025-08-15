import type {
  ConfigOptions,
  ReturnTypeOfConfigFunc,
  TypedFlatConfigItem,
  UserConfigs,
} from '@pixpilot/eslint-config';
import config, { javascriptConfigs, mergeOptions } from '@pixpilot/eslint-config';
import jsxA11yRulesOverride from './jsx-a11y-overrides';
import reactRulesOverride from './react-rules-overrides';

async function configFunc(
  userOptions?: ConfigOptions,
  ...userConfigs: UserConfigs
): Promise<ReturnTypeOfConfigFunc> {
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
  // Get the base no-underscore-dangle rule configuration
  const javascriptConf = await javascriptConfigs();

  const baseDangleRule = javascriptConf.find(
    (item): boolean =>
      typeof item.rules !== 'undefined' &&
      typeof item.rules['no-underscore-dangle'] !== 'undefined',
  );

  const mergedUserConfigs: TypedFlatConfigItem[] = [
    {
      rules: {
        'no-underscore-dangle':
          baseDangleRule && Array.isArray(baseDangleRule.rules?.['no-underscore-dangle'])
            ? [
                baseDangleRule.rules['no-underscore-dangle'][0], // severity
                {
                  ...(typeof baseDangleRule.rules['no-underscore-dangle'][1] ===
                    'object' && baseDangleRule.rules['no-underscore-dangle'][1] !== null
                    ? baseDangleRule.rules['no-underscore-dangle'][1]
                    : {}),
                  allow: [
                    ...(Array.isArray(
                      baseDangleRule.rules['no-underscore-dangle'][1]?.allow,
                    )
                      ? baseDangleRule.rules['no-underscore-dangle'][1].allow
                      : []),
                    '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
                  ],
                },
              ]
            : (baseDangleRule?.rules?.['no-underscore-dangle'] ?? [
                2,
                { allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] },
              ]),
      },
    },
  ];

  const baseConfig = await config(
    mergeOptions(options, userOptions || {}),
    ...userConfigs,
    ...mergedUserConfigs,
  );

  // Create React-specific rule overrides by extending base rules

  // Append the React-specific overrides to ensure they take precedence
  return baseConfig;
}

export default configFunc;
