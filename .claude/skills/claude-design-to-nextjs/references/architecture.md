# Design transformation architecture

## Ownership map

```text
design-src/                         imported design snapshot; immutable outside import
packages/ui/src/styles/            shared theme and design tokens
packages/ui/src/components/        reusable visual primitives
packages/ui/src/screens/           design-owned screen components
apps/web/app/                       App Router routes, layouts, loading/error boundaries
apps/web/lib/features/              server-only feature adapters and temporary TODO stubs
apps/web/lib/session.ts             per-request Better Auth session access
apps/web/proxy.ts                   optimistic cookie-presence redirect only
packages/db/src/schema/             Drizzle schema source of truth
packages/db/drizzle/                generated, committed SQL migrations
apps/web/lib/auth.ts                local Better Auth server configuration
apps/web/lib/auth-client.ts         browser-safe Better Auth client
apps/web/app/api/auth/[...all]/     Better Auth Route Handler
specs/backend/                      approved feature contracts for backend wiring
```

## Dependency direction

```text
apps/web routes ──> packages/ui screens/components
       │
       ├──────────> apps/web/lib/features ──> packages/db
       │
       └──────────> apps/web/lib/auth ──> packages/db auth schema

packages/ui ──X──> packages/db / apps/web server modules
```

`packages/ui` may use framework-neutral React types and client-safe libraries. It
must not import server-only modules or read environment variables.

## Screen contract

A screen is a presentational component whose dynamic values arrive as props. Keep
server data types narrow and explicit; do not pass Drizzle rows or Better Auth
session objects wholesale.

```tsx
/* design-src: screens/projects.html */

export interface ProjectsScreenProps {
  projects: Array<{ id: string; name: string; updatedLabel: string }>
  createProjectAction?: (formData: FormData) => Promise<void>
}
```

The route owns session validation, data loading, authorization, and conversion to
this view model.

## Server boundaries

- Read data in Server Components or server-only feature modules.
- Mutate through Server Actions when the caller is this app's UI.
- Use Route Handlers for webhooks, external consumers, file transfers, and APIs.
- Validate the session and authorization inside every Server Action/Route Handler.
- Derive `userId` from the validated session, never from form input or query params.
- Scope every user-owned Neon query by that `userId`.
- Keep `DATABASE_URL`, provider keys, and Better Auth secrets server-only; never
  use a `NEXT_PUBLIC_` prefix for them.

## Auth model

This repo hosts Better Auth in `apps/web`, backed by the same Neon/Drizzle
database. `proxy.ts` may redirect when the cookie is absent but is not proof of
identity. Protected pages, actions, and route handlers perform real validation
through `auth.api.getSession()` (normally via `apps/web/lib/session.ts`). The
client in `apps/web/lib/auth-client.ts` is for presentation and auth flows only.

## Design sync boundary

Incremental sync may change:

- design-owned files under `packages/ui/src/`;
- thin route files under `apps/web/app/` when route topology changes;
- explicitly planned TODO adapter contracts under `apps/web/lib/features/`.

It never implements persistence, edits schema/migrations, changes auth policy, or
adds secrets. Those are `/wire-backend` work after review.
