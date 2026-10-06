import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import defineConfig from '../../src/factory';

async function getTurboRule(turbo: boolean) {
  const configs = await defineConfig({ turbo });
  const eslint = new ESLint({
    overrideConfig: configs as ESLint.Options['overrideConfig'],
    overrideConfigFile: true,
  });
  const config = (await eslint.calculateConfigForFile('index.ts')) as {
    rules: Record<string, unknown>;
  };

  return config.rules['turbo/no-undeclared-env-vars'];
}

describe('turbo rules', () => {
  it('enables no-undeclared-env-vars when turbo is on', async () => {
    expect(await getTurboRule(true)).toEqual([2]);
  }, 60_000);

  it('does not enable turbo rules when turbo is off', async () => {
    expect(await getTurboRule(false)).toBeUndefined();
  }, 60_000);
});
