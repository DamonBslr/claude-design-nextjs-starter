---
name: drizzle-schema
description: >-
  Design or evolve the Neon Postgres schema with Drizzle for approved backend
  feature specs. Use during /wire-backend after specs are approved, when adding
  tables/columns/indexes/relations in packages/db/src/schema, generating reviewed
  SQL migrations, or checking user ownership. Never applies remote migrations
  without explicit approval.
---

# Build the Drizzle schema

Read `references/schema-guidance.md` before editing.

## Procedure

1. Read the approved specs in `specs/backend/` and existing schema/migrations.
2. Produce a table/column/index/constraint plan. Resolve ambiguities with the user;
   do not infer persisted fields solely from placeholder copy.
3. Define tables in focused files under `packages/db/src/schema/` and re-export
   them from `index.ts`.
4. Export Drizzle inferred select/insert types where they improve feature module
   contracts. Do not leak them directly into UI screen props.
5. Run formatting/typecheck for `packages/db`.
6. Generate a migration with `bun run db:generate`. Generation is local; inspect
   every generated SQL file and snapshot for destructive or surprising changes.
7. Present the migration diff and stop before `bun run db:migrate` or
   `bun run db:push`.
8. After explicit approval, apply only the reviewed migration and record the
   result. Use `db:push` only for disposable development databases.

## Rules

- Drizzle schema in git is the source of truth.
- Better Auth users live in `packages/db/src/schema/auth.ts` in this Neon database.
- Store the validated Better Auth user ID as `text` on app-owned rows and reference
  the local `user.id` when the relationship and delete behavior are intentional.
- Authorization lives in server code. Every user-owned query includes the actor's
  user ID; Neon provides no implicit application-level row ownership policy.
- Add indexes for ownership and common lookup/order predicates.
- Use constraints for invariants the database can enforce.
- Add migrations; do not rewrite already-applied history.
- Never expose `DATABASE_URL` or log connection strings.
