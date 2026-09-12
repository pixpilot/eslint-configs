import type { Linter } from 'eslint';
import type { DrizzleOptions } from './types';
import { drizzlePlugin } from './plugin';

/**
 * Flat config enabling the Drizzle ORM safety rules.
 *
 * Registers the rules under the `drizzle/*` namespace.
 */
export function drizzleConfigs(options: DrizzleOptions = {}): Linter.Config[] {
  const { files, level = 'error', overrides = {} } = options;

  return [
    {
      name: 'pixpilot/drizzle/rules',
      ...(files ? { files } : {}),
      plugins: {
        drizzle: drizzlePlugin,
      },
      rules: {
        'drizzle/prefer-timestamptz': level,
        'drizzle/require-enable-rls': level,
        'drizzle/require-user-id-cascade': level,
        ...overrides,
      },
    },
  ];
}

export default drizzleConfigs;
