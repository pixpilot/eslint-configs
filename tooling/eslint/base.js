import config from '@pixpilot/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
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
).append([
  {
    // This enables Prettier compatibility for flat config
    // See: https://github.com/eslint/eslint-config-prettier#flat-config
    ...eslintConfigPrettier,
  },
]);

export default baseConfig;
