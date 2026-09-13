---
'@pixpilot/eslint-config': minor
---

Make `pnpm/json-enforce-catalog` opt-in. Upstream enables it in any workspace whose `pnpm-workspace.yaml` declares catalogs, which reports every plain version specifier. Turn it back on with `pnpm: { catalogs: true }`.
