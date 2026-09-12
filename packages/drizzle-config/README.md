# @pixpilot/drizzle-config

ESLint flat config with safety rules for [Drizzle ORM](https://orm.drizzle.team/) schemas.

## Rules

| Rule                              | Description                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `drizzle/prefer-timestamptz`      | `timestamp()` from `drizzle-orm/pg-core` must pass `{ withTimezone: true }`.               |
| `drizzle/require-enable-rls`      | `pgTable()` from `drizzle-orm/pg-core` must be chained with `.enableRLS()`.                |
| `drizzle/require-user-id-cascade` | `uuid('user_id')` columns must `.references(() => authUsers.id, { onDelete: 'cascade' })`. |

All rules only track bindings imported from `drizzle-orm/pg-core`, including renamed imports.

`require-user-id-cascade` guards user-owned rows: a `user_id` column with no cascading
foreign key outlives the account it belongs to, which is both an orphaned-row bug and a
GDPR erasure problem. It offers a suggestion fix when `authUsers` (from
`@pixpilot/drizzle-supabase`) is already imported, and takes a `columns` option:

```js
import { drizzleConfigs } from '@pixpilot/drizzle-config';

export default drizzleConfigs({
  overrides: {
    'drizzle/require-user-id-cascade': ['error', { columns: ['user_id', 'owner_id'] }],
  },
});
```

## Usage

It is already bundled with [`@pixpilot/eslint-config`](../eslint-config), which loads it
lazily and enables it when `drizzle-orm` is installed:

```js
import config from '@pixpilot/eslint-config';

export default config({
  // auto-detected from `drizzle-orm`; set explicitly to force it on or off
  drizzle: true,
});
```

Standalone:

```js
import { drizzleConfigs } from '@pixpilot/drizzle-config';

export default [
  ...drizzleConfigs({
    files: ['src/db/**/*.ts'],
    level: 'error',
    overrides: {
      'drizzle/require-enable-rls': 'off',
    },
  }),
];
```

### Options

| Option      | Type                 | Default          | Description                              |
| ----------- | -------------------- | ---------------- | ---------------------------------------- |
| `files`     | `string[]`           | all linted files | Glob patterns the rules apply to.        |
| `level`     | `'error' \| 'warn'`  | `'error'`        | Severity used for the Drizzle rules.     |
| `overrides` | `Linter.RulesRecord` | `{}`             | Rule overrides appended after the rules. |
