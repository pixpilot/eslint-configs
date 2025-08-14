import type { UserConfig } from '../types';
import turboPlugin from 'eslint-plugin-turbo';

export const turboConfigs: UserConfig = {
  files: ['**/*.js', '**/*.ts', '**/*.tsx'],
  plugins: {
    turbo: turboPlugin,
  },
};
