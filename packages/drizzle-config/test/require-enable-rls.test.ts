import { describe, expect, it } from 'vitest';

import { lint, messagesFor } from './utils/lint';

const RULE = 'require-enable-rls';

describe('drizzle/require-enable-rls', () => {
  it('reports pgTable() without .enableRLS()', async () => {
    const messages = await lint(`
      import { pgTable } from 'drizzle-orm/pg-core';
      export const users = pgTable('users', {});
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(1);
  });

  it('accepts pgTable() chained with .enableRLS()', async () => {
    const messages = await lint(`
      import { pgTable } from 'drizzle-orm/pg-core';
      export const users = pgTable('users', {}).enableRLS();
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(0);
  });

  it('ignores pgTable() from other packages', async () => {
    const messages = await lint(`
      import { pgTable } from 'some-other-package';
      export const users = pgTable('users', {});
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(0);
  });
});
