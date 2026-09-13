import type { ConfigOptions } from '../../src/types';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const isPackageExists = vi.hoisted(() => vi.fn());

vi.mock('local-pkg', async (importOriginal) => ({
  ...(await importOriginal<typeof import('local-pkg')>()),
  isPackageExists,
}));

async function drizzleConfigNames(options?: ConfigOptions) {
  const { defineConfig } = await import('../../src/factory');
  const configs = await defineConfig(options);

  return configs
    .filter((config) => config.plugins?.['drizzle'] != null)
    .map((config) => config.name);
}

/**
 * The first `defineConfig()` call pulls in every ESLint plugin through dynamic
 * imports, which alone can exceed the default 5s per-test timeout. Warm the
 * module graph up front so the individual tests only measure their own work.
 */
beforeAll(async () => {
  isPackageExists.mockReturnValue(false);
  await drizzleConfigNames();
}, 60_000);

describe('drizzle auto-detection', () => {
  it('enables the rules when drizzle-orm is installed', async () => {
    isPackageExists.mockReturnValue(true);

    expect(await drizzleConfigNames()).toStrictEqual(['pixpilot/drizzle/rules']);
    expect(isPackageExists).toHaveBeenCalledWith('drizzle-orm');
  });

  it('skips the rules when drizzle-orm is absent', async () => {
    isPackageExists.mockReturnValue(false);

    expect(await drizzleConfigNames()).toStrictEqual([]);
  });

  it('lets an explicit option win over detection', async () => {
    isPackageExists.mockReturnValue(false);

    expect(await drizzleConfigNames({ drizzle: true })).toStrictEqual([
      'pixpilot/drizzle/rules',
    ]);
  });

  it('registers the drizzle plugin exactly once', async () => {
    isPackageExists.mockReturnValue(true);

    const { defineConfig } = await import('../../src/factory');
    const configs = await defineConfig();
    const drizzleConfigs = configs.filter(
      (config) => config.plugins?.['drizzle'] != null,
    );

    expect(drizzleConfigs).toHaveLength(1);
  });
});
