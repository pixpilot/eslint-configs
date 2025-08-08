# pnpm-turbo-monorepo-template

> ⚠️ **Opinionated Template:**
> This monorepo template is designed for our internal standards and workflows. Feel free to use, adapt, and extend it for your own projects.

A modern TypeScript monorepo template for npm packages, managed with pnpm and TurboRepo.

## ✨ Features

- Monorepo structure with workspaces
- TypeScript support
- Linting and formatting with ESLint and Prettier
- Build tooling with Rollup
- Easy dependency management with pnpm

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

- `packages/utils` – Example utility package

## 🚢 Releases

### 🤖 Automated Release (Recommended)

This monorepo uses the [Changeset Autopilot GitHub Action](https://github.com/pixpilot/changesets-autopilot) for fully automated, dependency-aware versioning and publishing. It:

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
