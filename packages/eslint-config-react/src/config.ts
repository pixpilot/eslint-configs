import type { ConfigFuncType, ConfigOptions } from '@pixpilot/eslint-config';
import config, { mergeOptions, overrideRules } from '@pixpilot/eslint-config';
import jsxA11yRulesOverride from './jsx-a11y-overrides';
import reactRulesOverride from './react-rules-overrides';

const dangleRules = overrideRules['no-underscore-dangle']!;

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
    rules: {
      'no-underscore-dangle': Array.isArray(dangleRules)
        ? [
            dangleRules[0],
            {
              ...dangleRules[1],
              allow: Array.isArray(dangleRules[1]?.allow)
                ? dangleRules[1].allow.concat(['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'])
                : ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
            },
          ]
        : dangleRules,
    },
  };

  // console.log(config(mergeOptions(options, op), ...rest));

  return config(mergeOptions(options, op), ...rest);
};

export default configFunc;
