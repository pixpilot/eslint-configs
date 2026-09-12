import type { DrizzleOptions } from '@pixpilot/drizzle-config';
import type { TypedFlatConfigItem } from '../types';

/**
 * Drizzle ORM safety rules.
 *
 * `@pixpilot/drizzle-config` is imported lazily so it is only evaluated when
 * the Drizzle rules are actually enabled.
 */
export async function drizzleConfigs(
  options: DrizzleOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const { drizzleConfigs: createDrizzleConfigs } =
    await import('@pixpilot/drizzle-config');

  return createDrizzleConfigs(options);
}
