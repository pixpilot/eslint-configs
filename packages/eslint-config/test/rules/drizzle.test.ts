import type { ConfigOptions } from '../../src/types';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import defineConfig from '../../src/factory';

const code = `
import { pgTable, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at'),
});
`;

async function lintDrizzleSchema(options: ConfigOptions) {
  const configs = await defineConfig(options);

  const eslint = new ESLint({
    overrideConfig: configs as ESLint.Options['overrideConfig'],
    overrideConfigFile: true,
  });

  const [result] = await eslint.lintText(code, { filePath: 'schema.js' });

  return (result?.messages ?? []).filter((message) =>
    message.ruleId?.startsWith('drizzle/'),
  );
}

describe('drizzle rules', () => {
  it('reports drizzle violations when enabled', async () => {
    const messages = await lintDrizzleSchema({ drizzle: true });

    expect(messages.map((message) => message.ruleId).sort()).toStrictEqual([
      'drizzle/prefer-timestamptz',
      'drizzle/require-enable-rls',
    ]);
  });

  it('does not load the drizzle rules when disabled', async () => {
    const messages = await lintDrizzleSchema({ drizzle: false });

    expect(messages).toHaveLength(0);
  });

  it('accepts drizzle options', async () => {
    const messages = await lintDrizzleSchema({
      drizzle: { level: 'warn', overrides: { 'drizzle/prefer-timestamptz': 'off' } },
    });

    expect(messages).toHaveLength(1);
    expect(messages[0]?.ruleId).toBe('drizzle/require-enable-rls');
    expect(messages[0]?.severity).toBe(1);
  });
});
