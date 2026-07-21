---
name: claude-design-sync
description: >-
  Incrementally apply committed Claude Design changes to an app previously
  transformed with claude-design-to-nextjs. Use for /sync-design, when a newer
  design-src import must be mapped into packages/ui and thin apps/web route or
  TODO adapters, or when asked to update the app from a new Claude Design bundle.
  Produces a review plan before edits and never wires backend logic.
---

# Incremental Claude Design sync

This skill applies a design delta, not a source-code patch. It never copies
untrusted handoff code into the app and never implements persistence or auth.

Read both reference files before mapping:

- `references/mapping-heuristics.md`
- `references/sync-plan-template.md`

## Preconditions

- The initial `claude-design-to-nextjs` transformation is complete.
- `DESIGN_SOURCE.json` names the import commit currently reflected in the UI.
- `design-src/` is clean and its versions are dedicated import commits.
- No overlapping uncommitted changes exist in the planned write scope.

If a new bundle was supplied, invoke `design-import` first. It owns the import
commit; this skill does not write `design-src/`.

## Procedure

### 1. Resolve the range

Read `synced_commit` from `DESIGN_SOURCE.json`. Validate that it exists and is an
ancestor of the target import. Use `--to <commit>` when supplied; otherwise choose
the latest commit touching `design-src/`.

Run `scripts/pending_imports.sh` or equivalent git commands to enumerate imports
oldest to newest. If the range contains none, report up to date and stop.

### 2. Inspect the semantic delta

Read the old and new manifests, prompt, tokens, and changed screens. Use:

```bash
git diff --name-status <from>..<to> -- design-src/
git diff <from>..<to> -- design-src/
```

Map every changed file exactly once. Use traceability comments in
`packages/ui/src` to find current owners; inspect shared components before
assuming a screen-local edit.

### 3. Classify every change

Use one of:

- `ui-only`
- `ui-contract`
- `route-change`
- `backend-follow-up`
- `delete-or-rename`
- `ignore`

Do not write real data/auth logic. A changed dynamic requirement becomes a typed
`// TODO(human-review)` adapter note and a `/wire-backend` follow-up.

### 4. Write the review gate

Create `SYNC_PLAN.md` from the template. Account for every changed path and list
all proposed targets. Explicitly assert that the plan does not touch:

- `design-src/`;
- `packages/db/` or migrations;
- Better Auth server/schema files or `apps/web/proxy.ts`;
- real implementations in `apps/web/lib/features/`;
- environment files or secrets.

Stop and obtain approval before applying the plan.

### 5. Apply the approved plan

Allowed targets are limited to:

- design-owned files under `packages/ui/src/`;
- `packages/ui/package.json` only when a screen export changes;
- thin `apps/web/app/**` route/layout/loading/error files when topology changes;
- explicitly listed TODO contracts in `apps/web/lib/features/`;
- `DESIGN_SOURCE.json` and `SYNC_PLAN.md` at finalization.

Keep route files thin. Never move database reads into Client Components. If a
screen prop contract changes, update the fixture/TODO adapter only enough to keep
the app honest and compilable; list the real implementation under backend
follow-ups.

### 6. Verify

Run:

```bash
bun run lint
bun run typecheck
bun run build
```

For each changed screen, compare the target route with the new normalized design
at the relevant mobile and desktop viewports. Check computed typography, colors,
radii, shadows, and major box geometry before the screenshot pass. Record every
approved deviation in `SYNC_PLAN.md`.

If a failure requires backend/schema/auth changes, stop and report it; do not
expand sync scope to make the build green.

### 7. Advance the anchor and prepare review

Only after all gates pass, update `DESIGN_SOURCE.json` to the target import. Create
a focused branch/commit/PR when the user asked for or approved that workflow.
Include the plan, verification results, and backend follow-ups. Do not auto-merge
or deploy.

## Guardrails

- Import history is immutable input.
- Sync owns presentation and thin route mapping, not backend behavior.
- Every dynamic capability change is reviewed through `/wire-backend`.
- First-time implementation uses `claude-design-to-nextjs`.
