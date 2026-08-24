---
"add-issue-links": patch
---

Update devDependencies (`@changesets/cli`, `@changesets/changelog-github`, `npm-run-all2`, `@vercel/ncc`, `globals`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `typescript-eslint`) to their latest versions, including the `@changesets/cli`@3 and `@changesets/changelog-github`@1 majors (now Node ^22.11 || ^24 || >=26 only, matching this action's Node 24 runtime) and the `npm-run-all2`@9 major (now that the action targets Node 24, satisfying its `^24.15.0` requirement).

Skipped major bumps that would break the toolchain: `@actions/core`@3 and `@actions/github`@9 are now ESM-only and incompatible with this project's CommonJS build; `typescript`@7 falls outside `typescript-eslint`'s supported peer range (`>=4.8.4 <6.1.0`); `@types/node` stays on the latest 24.x release to match the Node 24 runtime rather than jumping to the 26.x major.
