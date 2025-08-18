import type { TypedFlatConfigItem } from '../types';
import { interopDefault } from '@pixpilot/antfu-eslint-config';

/**
 * Prettier compatibility config for flat ESLint config.
 * See: https://github.com/prettier/eslint-config-prettier/blob/main/index.js
 */
export async function prettierConfigs(): Promise<TypedFlatConfigItem[]> {
  const eslintConfigPrettier = await interopDefault(import('eslint-config-prettier'));

  return [
    {
      ...eslintConfigPrettier,
      rules: {
        ...eslintConfigPrettier.rules,
        'antfu/if-newline': 'off',
        'antfu/curly': 'off',
        'antfu/indent-unindent': 'off',
        'antfu/consistent-list-newline': 'off',
        'antfu/consistent-chaining': 'off',
      },
    },
  ];
}
