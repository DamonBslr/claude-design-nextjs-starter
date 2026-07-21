---
description: Import a Claude Design handoff into the committed design-src snapshot (one commit per import)
argument-hint: <bundle-path-or-zip-or-url> [label]
allowed-tools: Bash Read Write Edit Glob Grep
---

Import a design version using the `design-import` skill.

Inputs:
- Bundle source: $1 — one of:
  - the **Claude Design share URL** from "Share with Claude Code"
    (`https://claude.ai/design/p/<uuid>?file=<Name>.dc.html`) — fetched via the
    `claude_design` MCP (`claude mcp add --scope user --transport http
    claude_design https://api.anthropic.com/v1/design/mcp`, auth via
    `/design-login`). Pasting the whole share snippet is fine — the URL is
    extracted from it.
  - a **local `.dc.html` file, folder, or zip** (downloaded export / local
    handoff) — works without the MCP.
  - any other public URL (best-effort; short-lived links expire ~1 hour).
- Label: $2 (optional) — short human name for this design version (defaults to
  the design file name).

Rules:
- Follow the skill's procedure in order. Normalization is deterministic and
  mechanical — never reinterpret or restyle the design during import.
- Refuse to run if `design-src/` or `DESIGN_SOURCE.json` has uncommitted changes.
- Write ONLY into `design-src/`; commit it alone as `design: import <label> (...)`
  after showing the user the change summary and confirming. One import = one commit.
- If the re-imported bundle is identical, report "nothing to import" — no empty commit.
- Do not touch `packages/ui`, `packages/db`, `apps/web`, or the anchor file —
  applying the design is `/sync-design`'s job (or `/init-from-design` on first run).
