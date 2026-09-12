---
'@pixpilot/drizzle-config': minor
'@pixpilot/eslint-config': minor
---

Add `@pixpilot/drizzle-config` with the Drizzle ORM safety rules (`drizzle/prefer-timestamptz`, `drizzle/require-enable-rls`, `drizzle/require-user-id-cascade`).

`@pixpilot/eslint-config` now loads it lazily via the `drizzle` option, which defaults to auto-detecting an installed `drizzle-orm`, and disables the upstream drizzle config so the plugin is only registered once.
