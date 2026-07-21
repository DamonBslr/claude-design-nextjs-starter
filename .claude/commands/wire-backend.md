---
description: Wire approved prototype features to Neon/Drizzle and Better Auth, one reviewed feature at a time
argument-hint: [feature-slug]
allowed-tools: Bash Read Write Edit Glob Grep
---

Run the `wire-backend` skill.

The workflow is spec-first and checkpointed:

1. Validate the existing Next.js, Neon/Drizzle, and Better Auth foundation.
2. Discover and spec the backend features implied by the transformed UI.
3. Stop for spec approval.
4. Generate Drizzle schema and migrations from the approved specs.
5. Stop before applying migrations to Neon.
6. Implement one approved feature at a time with `nextjs-wire-feature`, validating
   auth and tenant/user ownership on every server entry point.

Never expose `DATABASE_URL` or other secrets to Client Components. Never treat
`proxy.ts` as the security boundary. Never apply a migration, deploy, or change
Better Auth providers/security policy without explicit user approval.
