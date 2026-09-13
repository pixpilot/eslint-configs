import type { TypedFlatConfigItem } from '../types';

/**
 * Files that use the `.json` extension but are JSONC by convention, so the
 * tooling that reads them (TypeScript, VS Code) accepts comments.
 */
const JSONC_BY_CONVENTION = [
  '**/tsconfig.json',
  '**/tsconfig.*.json',
  '**/jsconfig.json',
  '**/jsconfig.*.json',
  '**/.vscode/*.json',
];

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
      files: ['**/*.jsonc', ...JSONC_BY_CONVENTION],
      rules: {
        'jsonc/comma-dangle': 'off',
        'jsonc/no-comments': 'off',
      },
    },
  ];
}
