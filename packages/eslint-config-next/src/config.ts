import type { ConfigFuncType, ConfigOptions } from '@pixpilot/eslint-config-react';
import config, { mergeOptions } from '@pixpilot/eslint-config-react';

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    type: 'app',
    nextjs: true,
  };

  return config(mergeOptions(options, op || {}), ...rest);
};

export default configFunc;
