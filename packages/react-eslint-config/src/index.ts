import type { ConfigFuncType, ConfigOptions } from '@internal/types';
import deepmerge from '@fastify/deepmerge';
import config from '@pixpilot/eslint-config';

const merge = deepmerge();

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

  return config(merge(options, op), ...rest);
};

export default configFunc;
