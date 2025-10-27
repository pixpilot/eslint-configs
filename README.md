# eslint-configs

> A modern TypeScript monorepo managed with pnpm and TurboRepo.

## 🚀 Getting Started

### Development

Build all packages:

```sh
pnpm build
```

Run tests:

```sh
pnpm test
```

Lint and format:

```sh
pnpm lint
pnpm format
```

### Create a New Package

Generate a new package in the monorepo:

```sh
pnpm run turbo:gen:init
```

## 📦 Packages

### [eslint-config](./packages/eslint-config/README.md)

Base ESLint configuration for PixPilot projects

### [eslint-config-next](./packages/eslint-config-next/README.md)

ESLint configuration for Next.js projects

### [eslint-config-react](./packages/eslint-config-react/README.md)

ESLint configuration for React projects

### [eslint-test-utils](./packages/eslint-test-utils/README.md)

Utilities for testing ESLint rules


## 🚢 Releases

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

## 📄 License

[MIT](LICENSE)
