import type { ConfigFuncType, ConfigOptions } from '@internal/types';
import deepmerge from '@fastify/deepmerge';
import config from '@pixpilot/eslint-config';

const merge = deepmerge();

const configFunc: ConfigFuncType = (op, ...rest) => {
  const options: ConfigOptions = {
    react: true,
    jsx: {
      a11y: {
        overrides: {
          'jsx-a11y/alt-text': 'error',
          'jsx-a11y/no-static-element-interactions': 'warn',
        },
      },
    },
  };

  return config(merge(options, op), ...rest);
};

export default configFunc;
