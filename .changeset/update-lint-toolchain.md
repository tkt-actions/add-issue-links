---
"add-issue-links": patch
---

Update devDependencies (`@changesets/cli`, `eslint`, `typescript-eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`) to their latest compatible versions.

Skipped major bumps that would break the toolchain: `@actions/core`@3 and `@actions/github`@9 are now ESM-only and incompatible with this project's CommonJS build; `typescript`@7 falls outside `ts-jest`'s supported peer range (`>=4.3 <7`); `@types/node` stays on the latest 24.x release to match the Node 24 runtime rather than jumping to the 26.x major.
