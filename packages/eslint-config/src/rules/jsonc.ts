import type { TypedFlatConfigItem } from '../types';

/**
 * Allows JSONC-only syntax while preserving the shared JSONC rule set.
 */
export async function jsoncConfigs(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: ['**/*.json'],
      rules: {
        'jsonc/no-comments': 'error',
      },
    },
    {
      files: ['**/*.jsonc'],
      rules: {
        'jsonc/comma-dangle': 'off',
        'jsonc/no-comments': 'off',
      },
    },
  ];
}
