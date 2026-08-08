---
"add-issue-links": patch
---

Fix `branch-prefix` input not falling back to its documented default (`issue-`) when omitted. The default was declared under a misspelled `dafault` key in `action.yml`, so GitHub Actions silently ignored it and the effective default was an empty string instead of `issue-`.
