import { describe, expect, it } from 'vitest';

import { drizzleMessages, lint, messagesFor } from './utils/lint';

const RULE = 'prefer-timestamptz';

describe('drizzle/prefer-timestamptz', () => {
  it('reports timestamp() without withTimezone', async () => {
    const messages = await lint(`
      import { timestamp } from 'drizzle-orm/pg-core';
      const createdAt = timestamp('created_at');
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(1);
  });

  it('reports renamed timestamp imports', async () => {
    const messages = await lint(`
      import { timestamp as ts } from 'drizzle-orm/pg-core';
      const createdAt = ts('created_at', { mode: 'date' });
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(1);
  });

  it('reports withTimezone: false', async () => {
    const messages = await lint(`
      import { timestamp } from 'drizzle-orm/pg-core';
      const createdAt = timestamp('created_at', { withTimezone: false });
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(1);
  });

  it('accepts withTimezone: true', async () => {
    const messages = await lint(`
      import { timestamp } from 'drizzle-orm/pg-core';
      const createdAt = timestamp('created_at', { withTimezone: true });
    `);

    expect(drizzleMessages(messages)).toHaveLength(0);
  });

  it('ignores timestamp() from other packages', async () => {
    const messages = await lint(`
      import { timestamp } from 'some-other-package';
      const createdAt = timestamp('created_at');
    `);

    expect(drizzleMessages(messages)).toHaveLength(0);
  });
});
