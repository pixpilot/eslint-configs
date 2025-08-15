import type { TypedFlatConfigItem } from '../types';
import { interopDefault } from '@pixpilot/antfu-eslint-config';

export async function turboConfigs(): Promise<TypedFlatConfigItem[]> {
  const pluginUnknown: unknown = await interopDefault(import('eslint-plugin-turbo'));
  const turboPlugin = pluginUnknown as Record<string, unknown>;

  return [
    {
      files: ['**/*.js', '**/*.ts', '**/*.tsx'],
      plugins: {
        turbo: turboPlugin,
      },
    },
  ];
}
