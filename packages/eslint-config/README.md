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
`drizzle/require-enable-rls`) are enabled automatically when `drizzle-orm` is installed,
and the config is only loaded when they are enabled.

```js
export default config({
  // true | false | { files, level, overrides }
  drizzle: true,
});
```
