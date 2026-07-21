---
description: Create or repair the DESIGN_SOURCE.json anchor used by incremental design sync
argument-hint: [import-commit-sha]
allowed-tools: Bash Read Write Edit Glob Grep
---

Run the `set-design-source` skill.

Use `$1` as the optional import commit. Confirm the selected commit is the exact
`design-src/` version currently reflected by the implemented UI; it is not always
the newest import. Write only `DESIGN_SOURCE.json`, show the pending import count,
and leave the file for user review without committing it automatically.
