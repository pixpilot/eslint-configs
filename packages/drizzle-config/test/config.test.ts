import { describe, expect, it } from 'vitest';

import { drizzleConfigs, drizzlePlugin } from '../src';
import { drizzleMessages, lint, messagesFor } from './utils/lint';

const code = `
  import { pgTable } from 'drizzle-orm/pg-core';
  export const users = pgTable('users', {});
`;

describe('drizzlePlugin', () => {
  it('exposes every rule', () => {
    expect(Object.keys(drizzlePlugin.rules)).toStrictEqual([
      'prefer-timestamptz',
      'require-enable-rls',
      'require-user-id-cascade',
    ]);
  });
});

describe('drizzleConfigs', () => {
  it('enables every rule as an error by default', async () => {
    const [config] = drizzleConfigs();

    expect(config?.rules).toStrictEqual({
      'drizzle/prefer-timestamptz': 'error',
      'drizzle/require-enable-rls': 'error',
      'drizzle/require-user-id-cascade': 'error',
    });
  });

  it('applies the configured severity', async () => {
    const messages = await lint(code, drizzleConfigs({ level: 'warn' }));

    const [message] = messagesFor(messages, 'require-enable-rls');

    expect(message?.severity).toBe(1);
  });

  it('applies rule overrides', async () => {
    const messages = await lint(
      code,
      drizzleConfigs({ overrides: { 'drizzle/require-enable-rls': 'off' } }),
    );

    expect(drizzleMessages(messages)).toHaveLength(0);
  });

  it('scopes rules to the configured files', async () => {
    const configs = drizzleConfigs({ files: ['**/*.sql.js'] });

    const matched = await lint(code, configs, 'schema.sql.js');
    const unmatched = await lint(code, configs, 'schema.js');

    expect(drizzleMessages(matched)).toHaveLength(1);
    expect(drizzleMessages(unmatched)).toHaveLength(0);
  });
});
