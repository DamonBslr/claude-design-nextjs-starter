---
description: Transform a Claude Design handoff into this Next.js app (initial transformation, run once)
argument-hint: <bundle-path-or-zip-or-url> [label]
allowed-tools: Bash Read Write Edit Glob Grep
---

Perform the **initial transformation** using the `claude-design-to-nextjs` skill.

Inputs:
- Claude Design source: $1 — the "Share with Claude Code" URL
  (`https://claude.ai/design/p/<uuid>?file=<Name>.dc.html`, fetched via the
  `claude_design` MCP — see `/import-design` for setup), or a local `.dc.html`
  file / handoff folder / `.zip`.
- Label: $2 (optional; defaults to the design file name)

Rules:
- Follow the skill's procedure in order; read its `references/architecture.md`
  before writing code.
- The bundle is imported via the `design-import` skill into the committed
  `design-src/` snapshot — after that, `design-src/` is read-only for everything
  except `/import-design`.
- Keep design-owned UI in `packages/ui` and route/data composition in `apps/web`.
- Leave backend touchpoints as typed server-side TODO stubs for `/wire-backend`;
  never put Neon access in Client Components or fabricate auth/secrets.
- Do not skip the visual fidelity verification step — the app must match the
  design screen-by-screen, with every deviation logged and justified.
- Validate with the repository's Bun/Turbo scripts and stop at
  `TRANSFORMATION_REPORT.md`; do not deploy or mutate remote services.
