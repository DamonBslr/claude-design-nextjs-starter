---
name: backend-feature-spec
description: >-
  Discover and specify backend work implied by transformed Claude Design screens
  and typed TODO adapters. Use during /wire-backend before schema or feature
  implementation, or when asked to turn UI stubs into reviewable Next.js,
  Neon/Drizzle, and Better Auth feature specs. Writes specs/backend artifacts and
  stops for approval; does not implement features.
---

# Discover and specify backend features

Read both references before authoring:

- `references/discovery-heuristics.md`
- `references/spec-template.md`

## Discovery

1. Read `TRANSFORMATION_REPORT.md` and `SYNC_PLAN.md` when present.
2. Find `TODO(human-review)` in `apps/web`, then inspect the screen prop/action
   contracts in `packages/ui/src/screens`.
3. Inspect existing feature modules, schema, routes, and auth helpers to avoid
   duplicating implemented work.
4. Cluster work into user-facing capabilities, not files.
5. Classify each feature as `read`, `mutation`, `route-handler`,
   `external-service`, or `auth` (multiple classifications allowed).
6. Order prerequisites: auth/ownership, schema, reads, mutations, then integrations.

## Artifacts

Write one file per feature at `specs/backend/<slug>.md` using the template, plus
`specs/backend/_index.md` with sequence, status, dependencies, classifications,
and source TODOs.

Repository specs are the source of truth. Create or mirror Linear issues only when
the user requests it and a Linear connector is available; never hardcode a team,
project, workflow status, or assignee.

Each spec must copy exact exported UI contracts, name schema requirements, state
auth/authorization rules, choose Server Action versus Route Handler, list env
requirements, and include testable acceptance criteria.

## Review gate

Stop after showing:

- discovered features and dependency order;
- unresolved product/data/auth questions;
- proposed tables and external integrations;
- files written.

Do not generate schema or implement code until the user approves the specs.
