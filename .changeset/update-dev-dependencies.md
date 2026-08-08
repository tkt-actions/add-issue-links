---
"add-issue-links": patch
---

Update devDependencies (eslint, globals, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, typescript-eslint) to their latest compatible versions.

Skipped major bumps that would break the toolchain: `@actions/core`@3 and `@actions/github`@9 are now ESM-only and incompatible with this project's CommonJS build; `typescript`@7 falls outside `typescript-eslint`'s supported range (`>=4.8.4 <6.1.0`); `npm-run-all2`@9 requires Node >=22.22.2, but this action targets Node 20 (`.node-version`, `action.yml`); `@types/node` stays on the latest 20.x release to match the Node 20 runtime.
