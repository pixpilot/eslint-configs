---
'@pixpilot/eslint-config': minor
---

Allow comments in files that use a `.json` extension but are JSONC by convention:
`tsconfig*.json`, `jsconfig*.json` and anything under `.vscode/`. Previously
`jsonc/no-comments` flagged them and each project had to turn the rule off itself.
