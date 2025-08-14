import type {
  ConfigOptions,
  ReturnTypeOfConfigFunc,
  UserConfigs,
} from '@pixpilot/eslint-config-react';
import config, { mergeOptions } from '@pixpilot/eslint-config-react';

// eslint-disable-next-line ts/promise-function-async
function configFunc(
  userOptions?: ConfigOptions,
  ...userConfigs: UserConfigs
): ReturnTypeOfConfigFunc {
  const defaultOptions: ConfigOptions = {
    type: 'app',
    nextjs: true,
  };

  return config(mergeOptions(defaultOptions, userOptions || {}), ...userConfigs);
}

export default configFunc;
