# @pixpilot/antfu-eslint-config

## 3.0.0

### Major Changes

- enforce pnpm dependency catalogs

## 2.18.0

### Minor Changes

- allow comments in JSONC files with .json extension
- e920b8e: Allow comments in files that use a `.json` extension but are JSONC by convention:
  `tsconfig*.json`, `jsconfig*.json` and anything under `.vscode/`. Previously
  `jsonc/no-comments` flagged them and each project had to turn the rule off itself.

## 2.17.0

### Minor Changes

- c91b4d5: Make `pnpm/json-enforce-catalog` opt-in. Upstream enables it in any workspace whose `pnpm-workspace.yaml` declares catalogs, which reports every plain version specifier. Turn it back on with `pnpm: { catalogs: true }`.

### Patch Changes

- make pnpm catalog enforcement opt-in

## 2.16.0

### Minor Changes

- add Drizzle ORM safety config
- update eslint and add new dependencies

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies [c746cb8]
  - @pixpilot/drizzle-config@0.3.0

## 2.15.0

### Minor Changes

- add Drizzle ORM safety config
- update eslint and add new dependencies

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @pixpilot/drizzle-config@0.2.0

## 2.14.0

### Minor Changes

- add Drizzle ORM safety config
- update eslint and add new dependencies
- a2887f2: Add `@pixpilot/drizzle-config` with the Drizzle ORM safety rules (`drizzle/prefer-timestamptz`, `drizzle/require-enable-rls`, `drizzle/require-user-id-cascade`).

  `@pixpilot/eslint-config` now loads it lazily via the `drizzle` option, which defaults to auto-detecting an installed `drizzle-orm`, and disables the upstream drizzle config so the plugin is only registered once.

### Patch Changes

- Updated dependencies
- Updated dependencies [a2887f2]
  - @pixpilot/drizzle-config@0.1.0

## 2.13.0

### Minor Changes

- add support for JSONC syntax and rules

### Patch Changes

- add `bugs` field to package.json files

## 2.12.3

### Patch Changes

- 85c18a4: fix: allows continue in loop

## 2.12.2

### Patch Changes

- allow intentional void expressions

## 2.12.1

### Patch Changes

- fc0a116: fix release

## 2.12.0

### Minor Changes

- enhance setup project action with node version file support

## 2.11.0

### Minor Changes

- update @pixpilot/antfu-eslint-config to version ^4.0.6

## 2.10.0

### Minor Changes

- disable promise rule for Markdown virtual code blocks

## 2.9.0

### Minor Changes

- 6fcc785: update and fixes

## 2.8.0

### Minor Changes

- add JSX and TSX configuration support

### Patch Changes

- update descriptions for arrow-body-style errors in JSX/TSX files

## 2.7.3

### Patch Changes

- update @pixpilot/antfu-eslint-config to version ^4.0.3

## 2.7.2

### Patch Changes

- c866299: patch release

## 2.7.1

### Patch Changes

- update dependencies in pnpm-workspace.yaml

## 2.7.0

### Minor Changes

- update CodeQL configuration and workflow

## 2.6.1

### Patch Changes

- update `eslint-plugin-turbo` dependency to use catalog reference

## 2.6.0

### Minor Changes

- refactor config functions to remove async and improve performance

## 2.5.1

### Patch Changes

- ef4e203: release

## 2.5.0

### Minor Changes

- update @pixpilot/dev-config to version 3.0.0 in pnpm-workspace.yaml

## 2.4.3

### Patch Changes

- conditionally add TypeScript and TSX override rules

## 2.4.2

### Patch Changes

- e2c2d93: relase base configs

## 2.4.1

### Patch Changes

- 466f631: release

## 2.4.0

### Minor Changes

- update TypeScript configuration and improve ESLint rules

## 2.3.0

### Minor Changes

- enhance ESLint configuration with test options

## 2.2.2

### Patch Changes

- update TypeScript rules and add related tests

## 2.2.1

### Patch Changes

- resolve cyclic dependency in @internal/prettier-config

## 0.1.0

### Minor Changes

- update repository URLs
