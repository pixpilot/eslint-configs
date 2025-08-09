import type { ConfigFuncType, ConfigOptions } from '@pixpilot/eslint-config-base';

import config, { deepMerge } from '@pixpilot/eslint-config-base';

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    react: true,
    type: 'app',
    jsx: {
      a11y: {
        overrides: {},
      },
    },
  };

  return config(deepMerge(options, op), ...rest);
};

export default configFunc;
