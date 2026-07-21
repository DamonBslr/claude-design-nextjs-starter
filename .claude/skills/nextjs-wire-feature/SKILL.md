---
name: nextjs-wire-feature
description: >-
  Implement one approved backend feature in the Next.js app using server-only
  Neon/Drizzle access and local Better Auth validation. Use for one
  specs/backend feature during /wire-backend, when replacing a typed TODO adapter,
  or when wiring a screen to real reads, Server Actions, Route Handlers, uploads,
  or external services. Preserves design-owned UI contracts and does not own
  migrations.
---

# Wire one approved feature

Implement exactly one approved `specs/backend/<slug>.md` per run.

## Procedure

1. Read the spec, source TODOs, consuming screen contracts, existing schema, and
   repository Next.js guidance.
2. Confirm required reviewed migrations are applied. If schema is missing, stop
   and return to `drizzle-schema`; do not author migrations in this skill.
3. Choose the narrow server entry points named by the spec:
   - Server Component/feature function for reads;
   - Server Action for app-initiated mutations;
   - Route Handler for external/public APIs, webhooks, streaming, or files.
4. Validate the Better Auth session at every protected entry point. Check roles
   and ownership server-side. Derive `userId` from the session.
5. Validate all untrusted input with the repository's chosen schema validator.
6. Query Neon only through server-only feature modules. Include the actor predicate
   in every user-owned read/update/delete.
7. Map database results to the exact UI view model. Keep Drizzle and session types
   out of `packages/ui`.
8. Implement explicit loading/empty/error/unauthorized/conflict states. Never
   report success before persistence or provider work succeeds.
9. Revalidate the narrow affected path/tag after mutations using APIs valid for
   the installed Next.js version.
10. Remove only the completed TODOs and update the spec/index status.

For external services, use server-only env, timeouts, bounded retries, and safe
logging. Never expose provider secrets or return sensitive upstream errors.

## Verification

Test the spec's acceptance criteria, including unauthenticated, unauthorized, and
cross-user cases. Then run relevant checks followed by:

```bash
bun run lint
bun run typecheck
bun run build
```

Report files changed, server entry points, tables/queries used, auth checks,
cache invalidation, verification, and remaining human/external steps.

## Guardrails

- One feature per run.
- No `design-src/` edits.
- No visual redesign in `packages/ui`.
- No migration ownership.
- No database or auth decisions in Client Components.
- `proxy.ts` never substitutes for real session validation.
- No deploys or remote configuration changes without explicit approval.
