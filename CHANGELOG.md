# add-issue-links

## 1.9.3

### Patch Changes

- [#730](https://github.com/tkt-actions/add-issue-links/pull/730) [`623d2e7`](https://github.com/tkt-actions/add-issue-links/commit/623d2e700119103317230ec70de4de49ec8b7647) Thanks [@tktcorporation](https://github.com/tktcorporation)! - Update devDependencies (`@changesets/cli`, `@changesets/changelog-github`, `npm-run-all2`, `@vercel/ncc`, `globals`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `typescript-eslint`) to their latest versions, including the `@changesets/cli`@3 and `@changesets/changelog-github`@1 majors (now Node ^22.11 || ^24 || >=26 only, matching this action's Node 24 runtime) and the `npm-run-all2`@9 major (now that the action targets Node 24, satisfying its `^24.15.0` requirement).

  Skipped major bumps that would break the toolchain: `@actions/core`@3 and `@actions/github`@9 are now ESM-only and incompatible with this project's CommonJS build; `typescript`@7 falls outside `typescript-eslint`'s supported peer range (`>=4.8.4 <6.1.0`); `@types/node` stays on the latest 24.x release to match the Node 24 runtime rather than jumping to the 26.x major.

- [#732](https://github.com/tkt-actions/add-issue-links/pull/732) [`2412909`](https://github.com/tkt-actions/add-issue-links/commit/241290955daac9aa3b9d2f1ca2b78773e8433964) Thanks [@tktcorporation](https://github.com/tktcorporation)! - Update devDependencies (`@changesets/cli`, `eslint`, `typescript-eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`) to their latest compatible versions.

  Skipped major bumps that would break the toolchain: `@actions/core`@3 and `@actions/github`@9 are now ESM-only and incompatible with this project's CommonJS build; `typescript`@7 falls outside `ts-jest`'s supported peer range (`>=4.3 <7`); `@types/node` stays on the latest 24.x release to match the Node 24 runtime rather than jumping to the 26.x major.

## 1.9.2

### Patch Changes

- [#725](https://github.com/tkt-actions/add-issue-links/pull/725) [`8bbb27a`](https://github.com/tkt-actions/add-issue-links/commit/8bbb27addccfc0c33507a2b223107fc1ba333401) Thanks [@tktcorporation](https://github.com/tktcorporation)! - Derive the Node.js version used in CI (`build-push`, `test`, `release` workflows) from a new `.node-version` file instead of hardcoding `20.x` in each workflow, so there is a single source of truth (also readable by nvm/volta/asdf and editor tooling). `docker-compose.yml` reads the same major version via a small `.env`. Also fixed the fallback `# Related Issue` header text in `main.ts` to match the documented default (`# Related issue`) in `action.yml`.

- [#725](https://github.com/tkt-actions/add-issue-links/pull/725) [`4b15212`](https://github.com/tkt-actions/add-issue-links/commit/4b15212df19c00a1aa9549749095d18bc96e2822) Thanks [@tktcorporation](https://github.com/tktcorporation)! - Fix `branch-prefix` input not falling back to its documented default (`issue-`) when omitted. The default was declared under a misspelled `dafault` key in `action.yml`, so GitHub Actions silently ignored it and the effective default was an empty string instead of `issue-`.

- [#728](https://github.com/tkt-actions/add-issue-links/pull/728) [`298a894`](https://github.com/tkt-actions/add-issue-links/commit/298a894710f20624ed4714ab9ea22082dd9d62a5) Thanks [@tktcorporation](https://github.com/tktcorporation)! - Upgrade the action's Node.js runtime from `node20` to `node24` in `action.yml`, and bump `.node-version` to `24` so CI (`build-push`, `test`, `release` workflows) builds and tests against the same version. `@types/node` was bumped to match. GitHub Actions is deprecating `node20` in favor of `node24`, so this keeps the action ahead of that cutoff.

- [#727](https://github.com/tkt-actions/add-issue-links/pull/727) [`db61662`](https://github.com/tkt-actions/add-issue-links/commit/db61662990d70d19d2cc0d59d28f7e6b3f0c113b) Thanks [@tktcorporation](https://github.com/tktcorporation)! - Update devDependencies (eslint, globals, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, typescript-eslint) to their latest compatible versions.

  Skipped major bumps that would break the toolchain: `@actions/core`@3 and `@actions/github`@9 are now ESM-only and incompatible with this project's CommonJS build; `typescript`@7 falls outside `typescript-eslint`'s supported range (`>=4.8.4 <6.1.0`); `npm-run-all2`@9 requires Node >=22.22.2, but this action targets Node 20 (`.node-version`, `action.yml`); `@types/node` stays on the latest 20.x release to match the Node 20 runtime.

<!-- Changesets inserts new release notes directly below this heading. -->

---

Releases up to and including `v1.9.1` predate Changesets. See the [GitHub Releases page](https://github.com/tkt-actions/add-issue-links/releases) for that history.
