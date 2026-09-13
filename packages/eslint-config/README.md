# @pixpilot/eslint-config

This is the base ESLint config for JavaScript/TypeScript projects at Pixpilot. While it is designed for our internal use, you are welcome to use it in your own projects as well!

## Usage

Add to your `eslint.config.mjs`:

```js
import config from '@pixpilot/eslint-config';

export default config();
```

## Drizzle ORM rules

The [`@pixpilot/drizzle-config`](../drizzle-config) rules (`drizzle/prefer-timestamptz`,
`drizzle/require-enable-rls`, `drizzle/require-user-id-cascade`) are enabled
automatically when `drizzle-orm` is installed, and the config is only loaded when
they are enabled. Set the option explicitly to override the detection.

```js
export default config({
  // true | false | { files, level, overrides }
  drizzle: true,
});
```

## JSON and JSONC

`jsonc/no-comments` is an error for `.json`, and off for `.jsonc` plus the files
that use a `.json` extension but are JSONC by convention: `tsconfig*.json`,
`jsconfig*.json` and anything under `.vscode/`.

## pnpm catalog rules

`pnpm/json-enforce-catalog` is **off by default**. Upstream turns it on for any
workspace whose `pnpm-workspace.yaml` already declares catalogs, which then
reports every plain version specifier in every `package.json`.

Opt in per project when you want every dependency to live in a catalog:

```js
export default config({
  pnpm: { catalogs: true },
});
```

The other pnpm rules (`pnpm/json-valid-catalog`, `pnpm/json-prefer-workspace-settings`
and the `pnpm/yaml-*` set) are unaffected. To disable pnpm linting entirely, use
`pnpm: false`.
