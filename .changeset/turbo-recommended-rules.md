---
'@pixpilot/eslint-config': minor
---

`turbo: true` now enables `turbo/no-undeclared-env-vars` (the rule from
`eslint-plugin-turbo`'s recommended config). Previously the option only
registered the plugin, so every project had to add the rule itself.
