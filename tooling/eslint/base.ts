import config from '@pixpilot/eslint-config';
import turboPlugin from 'eslint-plugin-turbo';

const baseConfig: unknown = config(
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
