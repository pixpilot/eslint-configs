import turboPlugin from 'eslint-plugin-turbo';

import config from '../../packages/eslint-config-base/src/config';

const baseConfig: ReturnType<typeof config> = config(
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
