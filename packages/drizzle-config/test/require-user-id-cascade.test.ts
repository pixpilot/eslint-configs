import { describe, expect, it } from 'vitest';

import { drizzleConfigs } from '../src';
import { lint, messagesFor } from './utils/lint';

const RULE = 'require-user-id-cascade';

describe('drizzle/require-user-id-cascade', () => {
  it('reports a user_id column without a foreign key', async () => {
    const messages = await lint(`
      import { pgTable, uuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        userId: uuid('user_id').notNull(),
      }).enableRLS();
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(1);
  });

  it('reports a reference without onDelete: cascade', async () => {
    const messages = await lint(`
      import { authUsers } from '@pixpilot/drizzle-supabase';
      import { pgTable, uuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        userId: uuid('user_id').references(() => authUsers.id),
      }).enableRLS();
    `);

    const [message] = messagesFor(messages, RULE);

    expect(message?.message).toContain("onDelete: 'cascade'");
  });

  it('accepts a cascading reference', async () => {
    const messages = await lint(`
      import { authUsers } from '@pixpilot/drizzle-supabase';
      import { pgTable, uuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        userId: uuid('user_id')
          .notNull()
          .references(() => authUsers.id, { onDelete: 'cascade' }),
      }).enableRLS();
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(0);
  });

  it('ignores other columns and non-drizzle uuid() calls', async () => {
    const messages = await lint(`
      import { uuid } from 'some-other-package';
      import { pgTable, uuid as pgUuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        id: pgUuid('id').primaryKey(),
        userId: uuid('user_id'),
      }).enableRLS();
    `);

    expect(messagesFor(messages, RULE)).toHaveLength(0);
  });

  it('honours the columns option', async () => {
    const code = `
      import { pgTable, uuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        ownerId: uuid('owner_id').notNull(),
      }).enableRLS();
    `;

    const withDefaults = await lint(code);
    const withOption = await lint(
      code,
      drizzleConfigs({
        overrides: {
          'drizzle/require-user-id-cascade': ['error', { columns: ['owner_id'] }],
        },
      }),
    );

    expect(messagesFor(withDefaults, RULE)).toHaveLength(0);
    expect(messagesFor(withOption, RULE)).toHaveLength(1);
  });

  it('suggests the cascading reference when authUsers is in scope', async () => {
    const messages = await lint(`
      import { authUsers } from '@pixpilot/drizzle-supabase';
      import { pgTable, uuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        userId: uuid('user_id').notNull(),
      }).enableRLS();
    `);

    const [message] = messagesFor(messages, RULE);

    expect(message?.suggestions?.[0]?.fix.text).toBe(
      ".references(() => authUsers.id, { onDelete: 'cascade' })",
    );
  });

  it('offers no suggestion when authUsers is not imported', async () => {
    const messages = await lint(`
      import { pgTable, uuid } from 'drizzle-orm/pg-core';
      export const posts = pgTable('posts', {
        userId: uuid('user_id').notNull(),
      }).enableRLS();
    `);

    const [message] = messagesFor(messages, RULE);

    expect(message?.suggestions ?? []).toHaveLength(0);
  });
});
