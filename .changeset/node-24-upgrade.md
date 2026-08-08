---
"add-issue-links": patch
---

Upgrade the action's Node.js runtime from `node20` to `node24` in `action.yml`, and bump `.node-version` to `24` so CI (`build-push`, `test`, `release` workflows) builds and tests against the same version. `@types/node` was bumped to match. GitHub Actions is deprecating `node20` in favor of `node24`, so this keeps the action ahead of that cutoff.
