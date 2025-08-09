import type { ConfigFuncType, ConfigOptions } from '@pixpilot/eslint-config-react';
import config, { deepMerge } from '@pixpilot/eslint-config-react';

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
