# Pixpilot ESLint Configs Monorepo

This monorepo contains shared ESLint configurations and utilities used across Pixpilot projects. It is designed to provide consistent, high-quality linting for JavaScript, TypeScript, React, and Next.js codebases at Pixpilot. While these configs are tailored for our internal standards, you are welcome to use, adapt, and extend them for your own projects!

## ✨ Features

- Multiple shareable ESLint configs for different stacks (base, React, Next.js)
- TypeScript and JavaScript support
- Utilities for testing custom ESLint rules
- Consistent linting and formatting across all Pixpilot projects
- Managed with pnpm and TurboRepo for fast, reliable monorepo workflows

## 🚀 Getting Started

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Build all packages:
   ```sh
   pnpm build
   ```
3. Run tests:
   ```sh
   pnpm test
   ```

## 📦 Packages

- [eslint-config-base](./packages/eslint-config-base) – Base ESLint config for JavaScript/TypeScript projects
- [eslint-config-next](./packages/eslint-config-next) – ESLint config for Next.js projects
- [eslint-config-react](./packages/eslint-config-react) – ESLint config for React projects
- [eslint-test-utils](./packages/eslint-test-utils) – Utilities for testing custom ESLint rules

## 🚢 Releases

This monorepo uses the [Changeset Autopilot GitHub Action](https://github.com/pixpilot/changesets-autopilot) for automated, dependency-aware versioning and publishing. It:

- Detects conventional commits and generates changesets automatically
- Handles branch-based release channels (main, next, beta, etc.)
- Versions and publishes only changed packages to npm
- Manages pre-releases and dist-tags
- Runs entirely in CI for maximum reliability

**How it works:**

- On every push to a release branch, the action analyzes commits, generates changesets, versions packages, and publishes to npm.
- No manual steps are needed—just follow the conventional commit format and push to the correct branch.
- See the [Changeset Autopilot documentation](https://github.com/pixpilot/changesets-autopilot) for setup and configuration details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT](LICENSE)
