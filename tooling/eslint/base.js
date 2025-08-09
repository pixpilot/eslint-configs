import config from '@pixpilot/eslint-config-base';

import turboPlugin from 'eslint-plugin-turbo';

/** @type {any} */
const baseConfig = config(
  {
    pnpm: true,
    stylistic: {
      semi: true,
      quotes: 'single',
    },
  },
  {
    rules: {
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      turbo: turboPlugin,
    },
  },
);

export default baseConfig;
