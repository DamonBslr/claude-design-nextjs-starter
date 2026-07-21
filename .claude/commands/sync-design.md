---
description: Apply the latest Claude Design changes to the Next.js presentation layer (incremental sync)
argument-hint: [bundle-path-or-url] [--to <commit>]
allowed-tools: Bash Read Write Edit Glob Grep
---

Perform an **incremental design sync** using the `claude-design-sync` skill.

Inputs:
- New design version: $1 (optional) — a Claude Design source that hasn't been
  imported yet: the "Share with Claude Code" URL (via the `claude_design` MCP),
  or a local `.dc.html` / folder / zip. The skill invokes `design-import` on it
  first (one `design: import ...` commit), then syncs. Omit it to sync imports
  that are already committed.
- `--to <commit>` (optional): sync only up to this import commit instead of the
  newest — the **stepwise** mode for applying design versions one at a time. Must
  be after the current anchor, at-or-before HEAD, and touch `design-src/`.
- The last-synced state comes from `DESIGN_SOURCE.json` — set it first with
  `/set-design-source` if it doesn't exist yet.

**Stepwise (one import at a time):** run `bun run design:pending` to list the pending
import commits, then run `/sync-design --to <next-sha>` for each in order — review
the plan, approve, let it open a PR and advance the anchor — before moving to the
next. The final one can be a plain `/sync-design` (no `--to`) to catch up.

Rules:
- Follow the skill's procedure in order; read its `references/mapping-heuristics.md`
  and `references/sync-plan-template.md` before mapping.
- `design-src/` is written only by `/import-design` — this sync reads its git
  history and never modifies it.
- Write only to design-owned `packages/ui` files plus explicitly planned thin
  `apps/web` route/TODO adapters. Never modify `packages/db`, Better Auth server
  configuration, or wire real auth, secrets, migrations, or data access during
  design sync.
- Stop at the **sync-review gate** (`SYNC_PLAN.md`) before changing any file, and
  stop again at the PR. Do not auto-merge or deploy.
- Every changed screen must pass the visual fidelity verification (design-src vs.
  rebuilt app) before the PR opens.
- This command is for updates only. First-time bootstrap is `/init-from-design`.
