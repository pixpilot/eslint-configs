import type { UserOption } from '../types';
import turboPlugin from 'eslint-plugin-turbo';

export const turboConfigs: UserOption = {
  files: ['**/*.js', '**/*.ts', '**/*.tsx'],
  plugins: {
    turbo: turboPlugin,
  },
};
