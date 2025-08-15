import config from '../../packages/eslint-config/src/factory';

const baseConfig: ReturnType<typeof config> = config(
  {
    pnpm: true,
    turbo: true,
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
);

export default baseConfig;
