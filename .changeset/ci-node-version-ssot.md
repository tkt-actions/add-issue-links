---
"add-issue-links": patch
---

Derive the Node.js version used in CI (`build-push`, `test`, `release` workflows) from `package.json`'s new `engines.node` field instead of hardcoding `20.x` in each workflow, so there is a single source of truth. Also fixed the fallback `# Related Issue` header text in `main.ts` to match the documented default (`# Related issue`) in `action.yml`.
