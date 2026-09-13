import type { TypedFlatConfigItem } from '../types';

/**
 * Disables `pnpm/json-enforce-catalog`, which the upstream config turns on as
 * soon as a `pnpm-workspace.yaml` with catalogs is found. Requiring every
 * dependency to move into a catalog is a project-level decision, so it is
 * opt-in here via `pnpm: { catalogs: true }`.
 *
 * The remaining pnpm rules (`json-valid-catalog`, the `yaml-*` set) stay on.
 */
export async function pnpmConfigs(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: ['package.json', '**/package.json'],
      name: 'pixpilot/pnpm/no-enforce-catalog',
      rules: {
        'pnpm/json-enforce-catalog': 'off',
      },
    },
  ];
}
