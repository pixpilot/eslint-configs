import config from '@pixpilot/eslint-config';

const eslintConfig: any = config({
  pnpm: true,
  stylistic: {
    semi: true,
    quotes: 'single',
  },
});

export default eslintConfig;
