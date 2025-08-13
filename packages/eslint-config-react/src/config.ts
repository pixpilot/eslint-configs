import type { ConfigFuncType, ConfigOptions, Rules } from '@pixpilot/eslint-config';
import config, { jsOverrideRules, mergeOptions } from '@pixpilot/eslint-config';
import jsxA11yRulesOverride from './jsx-a11y-overrides';
import reactRulesOverride from './react-rules-overrides';

// Get the base no-underscore-dangle rule configuration
const baseDangleRule = (jsOverrideRules as { rules: Rules }).rules[
  'no-underscore-dangle'
];

// eslint-disable-next-line ts/promise-function-async
const configFunc: ConfigFuncType = (op, ...rest) => {
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

  const baseConfig = config(mergeOptions(options, op || {}), ...rest);

  // Create React-specific rule overrides by extending base rules
  const reactRuleOverrides = {
    rules: {
      ...(baseDangleRule !== undefined && {
        'no-underscore-dangle':
          Array.isArray(baseDangleRule) && baseDangleRule.length > 1
            ? [
                baseDangleRule[0], // Keep the same severity level
                {
                  ...(typeof baseDangleRule[1] === 'object' && baseDangleRule[1] !== null
                    ? baseDangleRule[1]
                    : {}),
                  allow: [
                    ...(Array.isArray(baseDangleRule[1]?.allow)
                      ? baseDangleRule[1].allow
                      : []),
                    '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
                  ],
                },
              ]
            : baseDangleRule,
      }),
    } satisfies Rules,
  };

  // Append the React-specific overrides to ensure they take precedence
  return baseConfig.append([reactRuleOverrides]);
};

export default configFunc;
