---
name: better-auth-access
description: >-
  Wire or audit route protection and user/role access through this repository's
  local Better Auth server backed by Neon/Drizzle. Use for auth-classified backend
  specs, protected Next.js pages, Server Actions, Route Handlers, sign-in/up flows,
  provider setup, or session/access-control bugs. Never treats proxy cookie checks
  as authorization or creates a parallel auth stack.
---

# Better Auth access control

This app hosts Better Auth in `apps/web/lib/auth.ts`; auth records use the schema
in `packages/db/src/schema/auth.ts` and the API is mounted at
`apps/web/app/api/auth/[...all]/route.ts`.

## Procedure

1. Read the auth server, shared `auth-config.ts`, auth client, session helper,
   proxy, auth Route Handler, auth schema, and sign-in/sign-up pages before editing.
2. Classify routes as public, signed-in, or role/ownership restricted.
3. Keep `proxy.ts` limited to fast optimistic redirects and a narrow matcher.
4. In protected Server Components, call `getCachedSession()` or
   `auth.api.getSession()` and redirect/render the correct unauthorized state.
5. In every Server Action and Route Handler, validate the session again and check
   role/resource authorization before data access.
6. Use `apps/web/lib/auth-client.ts` only for browser auth flows and presentation.
7. Preserve callback URLs through local sign-in/up and accept only safe internal
   destinations unless an explicit allowlist says otherwise.
8. When changing Better Auth options or plugins, generate/review any required
   schema change through `drizzle-schema` before use.
9. Test no cookie, forged/stale cookie, valid session, wrong role, and cross-user
   resource access.

## Human/external gate

When configuration is required, show the checklist and stop:

- set `BETTER_AUTH_URL` to this app's canonical origin;
- generate and store a strong `BETTER_AUTH_SECRET`;
- apply the reviewed Better Auth schema migration;
- configure approved provider credentials and callback URLs;
- verify secure-cookie and callback behavior on HTTPS.

Never print or commit secrets, enable providers without explicit scope, mutate a
remote database without approval, or create a second auth implementation.
