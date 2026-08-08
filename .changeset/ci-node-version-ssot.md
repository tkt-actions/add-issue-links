---
"add-issue-links": patch
---

Derive the Node.js version used in CI (`build-push`, `test`, `release` workflows) from a new `.node-version` file instead of hardcoding `20.x` in each workflow, so there is a single source of truth (also readable by nvm/volta/asdf and editor tooling). `docker-compose.yml` reads the same major version via a small `.env`. Also fixed the fallback `# Related Issue` header text in `main.ts` to match the documented default (`# Related issue`) in `action.yml`.
