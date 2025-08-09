import type { ConfigFuncType, ConfigOptions } from '@pixpilot/eslint-config-base';

import config from '@pixpilot/eslint-config';
import { deepMerge } from '@pixpilot/eslint-config-base';

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    react: true,
    type: 'app',
    jsonc: true,
    yaml: true,
    gitignore: true,
    unicorn: true,
    imports: true,
    markdown: true,
    stylistic: true,
    regexp: true,
    // pnpm: true,
    jsx: {
      a11y: {
        overrides: {},
      },
    },
  };

  return config(deepMerge(options, op), ...rest);
};

export default configFunc;
