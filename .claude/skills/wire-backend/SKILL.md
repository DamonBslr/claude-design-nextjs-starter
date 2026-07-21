---
name: wire-backend
description: >-
  Orchestrate the reviewed backend delivery flow for a transformed Claude Design
  app on Next.js 16, Neon/Drizzle, and Better Auth. Use for /wire-backend, when
  asked to implement all backend TODOs, or to continue the spec-schema-feature
  sequence. Enforces human gates before schema work, remote migrations, and each
  feature rollout.
---

# Wire the backend

Own the sequence and gates. Do not skip ahead because a later step looks obvious.

## Sequence

### 1. Foundation

Invoke `nextjs-backend-foundation`.

Gate: required local env and Better Auth schema/configuration are present. Do not
read or echo secret values.

### 2. Discover and specify

Invoke `backend-feature-spec` across the transformed screens and TODO adapters.

Gate: the user reviews and approves `specs/backend/_index.md` and each feature
spec. No schema or implementation before approval.

### 3. Schema

Invoke `drizzle-schema` for the approved data model. This orchestrator owns schema
coordination so feature work does not create conflicting migrations.

Gate: show generated SQL and stop. Run `bun run db:migrate` only after explicit
approval for the resolved Neon target. Never use `db:push` on production.

### 4. Implement features in dependency order

For each approved spec:

1. Confirm dependencies are complete and required migration is applied.
2. Mark the feature in progress in `specs/backend/_index.md`.
3. Invoke `better-auth-access` when the feature changes access rules.
4. Invoke `nextjs-wire-feature` for exactly that feature.
5. Review auth/ownership checks and run the feature acceptance criteria.
6. Run lint, typecheck, and build.
7. Stop for the feature's human/external verification gate.
8. Mark complete only after acceptance succeeds, then continue.

Repository specs are authoritative. Mirror to Linear only when the user requests
it and a connector is available.

## Remote and security gates

Explicit approval is required before:

- applying a migration or pushing schema;
- changing Better Auth providers, cookie/security policy, or auth schema;
- setting provider or webhook secrets;
- deploying the app or a server endpoint;
- sending external messages or updating issue state outside the repository.

## Completion

Finish only when approved features are implemented, migrations are accounted for,
acceptance criteria pass, TODOs are reconciled, and remaining external/manual
steps are reported. Never broaden backend work into a design rewrite.
