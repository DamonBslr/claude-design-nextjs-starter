---
name: nextjs-backend-foundation
description: >-
  Validate and prepare this repository's Next.js 16, Neon/Drizzle, and central
  Better Auth backend foundation before feature implementation. Use for the first
  stage of /wire-backend, when setting up server-only data access, checking env
  templates, or repairing the starter foundation. Does not create schema or
  implement product features.
---

# Validate the backend foundation

Read `references/server-boundaries.md`, then run
`scripts/validate_foundation.sh` from the repository root.

## Procedure

1. Confirm the root uses Bun workspaces/Turbo and `apps/web` is Next.js 16 App
   Router.
2. Confirm `packages/db` exports a Neon/Drizzle client and schema, and the root
   exposes `db:generate`, `db:migrate`, `db:push`, and `db:studio`.
3. Confirm `apps/web/lib/auth.ts`, `auth-config.ts`, `auth-client.ts`, and
   `app/api/auth/[...all]/route.ts` provide the local Better Auth server/client.
4. Confirm Better Auth's user/account/session/verification tables are exported
   from `packages/db/src/schema/`.
5. Confirm `apps/web/lib/session.ts` memoizes real server session validation and
   `apps/web/proxy.ts` is documented as optimistic only.
6. Confirm `apps/web/.env.example` contains placeholders for `DATABASE_URL`,
   `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`, with no live secrets.
7. Confirm app code never imports `@workspace/db/client` from a Client Component.
8. Confirm the build environment supplies `DATABASE_URL`; the local Better Auth
   server imports the Drizzle client during module evaluation. Do not hide a
   missing production value with a placeholder or expose it to the browser.
9. Run `bun run typecheck`. Do not run a migration or connect to production.

## Human gate

Stop when a local env value or external service change is needed. Ask the user to:

- create/select a Neon project and put its pooled connection string in
  `apps/web/.env.local` as `DATABASE_URL`;
- generate and store a strong `BETTER_AUTH_SECRET`;
- set `BETTER_AUTH_URL` to this app's canonical origin;
- apply the reviewed Better Auth schema migration before sign-in/sign-up testing.

Do not read or echo real env values. Do not create remote projects, change auth
providers/security policy, or apply migrations without explicit approval.
