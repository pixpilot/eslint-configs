import type { Rules } from '@pixpilot/antfu-eslint-config';
import type { TypedFlatConfigItem } from '../types';
import { GLOB_JSX, GLOB_TSX } from '@pixpilot/antfu-eslint-config';

const commonRules: Rules = {
  'arrow-body-style': 'off',
};

/**
 * Returns ESLint config overrides for JSX and TSX files.
 */
export function jsxConfigs(): TypedFlatConfigItem[] {
  return [
    {
      files: [GLOB_JSX],

      rules: { ...commonRules },
    },
  ];
}

export async function tsxConfigs(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [GLOB_TSX],
      rules: {
        ...commonRules,
        'ts/explicit-module-boundary-types': 'off',
      },
    },
  ];
}
