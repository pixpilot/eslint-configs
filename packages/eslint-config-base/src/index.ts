import type { ConfigFuncType, ConfigOptions } from '@internal/types';
import { deepMerge } from '@internal/utils';

import config from '@pixpilot/eslint-config';

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    type: 'lib',
    jsonc: true,
    yaml: true,
    gitignore: true,
    unicorn: true,
    imports: true,
    markdown: true,
    regexp: true,
    autoRenamePlugins: true,
  };

  return config(deepMerge(options, op), ...rest);
};

export default configFunc;

export type { ConfigFuncType, ConfigOptions };
