# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This repo runs **Next.js 16** with breaking changes from earlier versions you may know (e.g. Middleware is renamed to **Proxy** — `proxy.ts` with a `proxy` function, not `middleware.ts`). Before writing Next.js code, read the relevant guide in the installed package's `next/dist/docs/` when present and heed deprecation notices. If the package omits those files, use the official docs matching the installed version. Do not assume App Router conventions from training data carry over.

## Commands

All commands run from the repo root and fan out to workspaces via Turbo. **Package manager is `bun`** (not pnpm — the README's `pnpm dlx` examples are stale).

```bash
bun run dev          # turbo dev — runs all apps (web on :3000)
bun run build        # turbo build
bun run lint         # turbo lint (eslint per workspace)
bun run typecheck    # turbo typecheck (tsc --noEmit per workspace)
bun run format       # prettier --write across workspaces
```

Database (Drizzle + Neon, all require `DATABASE_URL`):

```bash
bun run db:generate  # generate SQL migrations into packages/db/drizzle/
bun run db:migrate   # apply migrations to Neon
bun run db:push      # push schema directly — dev only
bun run db:studio    # Drizzle Studio
bun run design:pending # list imported design versions not yet synced
```

To run a single workspace task directly, `cd` into it and run its script (e.g. `cd apps/web && bun run dev`), or use `turbo dev --filter=web`.

Adding shadcn components (places them in `packages/ui/src/components/`, not the app):

```bash
bunx shadcn@latest add <component> -c apps/web
```

There is no test runner configured in this repo.

## Architecture

Turborepo monorepo (`apps/*`, `packages/*`). One app today (`apps/web`), with shared logic factored into workspace packages consumed via `workspace:*`.

- **`apps/web`** — the Next.js 16 app. `next.config.ts` sets `turbopack.root` to the monorepo root and transpiles the raw TypeScript from `@workspace/ui`.
- **`packages/ui`** (`@workspace/ui`) — shared shadcn/ui component library. Exports `./components/*`, `./hooks/*`, `./lib/*`, and `./globals.css`. **All UI primitives live here** — compose app UI from these, do not write one-off primitives in the app.
- **`packages/db`** (`@workspace/db`) — Neon Postgres + Drizzle ORM.
- **`packages/eslint-config`**, **`packages/typescript-config`** — shared config consumed by every workspace's local `eslint.config.js` / `tsconfig.json`.

### Authentication (local Better Auth)

`apps/web` owns its Better Auth server in `lib/auth.ts` and exposes it through
`app/api/auth/[...all]/route.ts`. Users, accounts, sessions, and verifications
live in the same Neon/Drizzle database as the app. No global auth server,
shared secret, trusted-origin registration, or cross-subdomain cookie is used.

Two-layer auth pattern:

1. **Proxy** (`apps/web/proxy.ts`) performs an optimistic cookie-presence check and redirects to the local `/sign-in` page. It does not perform authorization.
2. **Secure validation** uses `getCachedSession` from `apps/web/lib/session.ts`, which calls `auth.api.getSession` against the database and is memoized per render pass.

Client components import `authClient` from `apps/web/lib/auth-client.ts`. Required
env vars are `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and `DATABASE_URL`.

### Database (`@workspace/db`)

Neon serverless HTTP driver + Drizzle. Import only from **Server Components / Server Actions** — never from Client Components:

```ts
import { db } from "@workspace/db/client"
import * as schema from "@workspace/db/schema"
```

Define tables under `packages/db/src/schema/` and re-export from `src/schema/index.ts`. Generated migrations land in `packages/db/drizzle/`. `DATABASE_URL` lives in `apps/web/.env.local`.

### Claude Design import and sync

The design workflow is deliberately split from backend implementation:

1. `/import-design <source>` normalizes a Claude Design handoff into committed
   `design-src/`. No other workflow writes that directory.
2. `/init-from-design <source>` performs the first Next.js transformation with
   `claude-design-to-nextjs`.
3. `/sync-design [source] [--to <commit>]` applies later design deltas after a
   review gate. Run `bun run design:pending` to inspect the queue.
4. `/wire-backend [feature]` specs and implements approved server work with
   Neon/Drizzle and Better Auth.

Design-owned screens live in `packages/ui/src/screens/`. App Router files in
`apps/web/app/` stay thin and own composition. Server-only feature modules and
temporary typed TODO adapters live in `apps/web/lib/features/`. Design sync never
implements persistence, edits migrations, changes auth policy, or writes secrets.

## Styling

Theme tokens live in [packages/ui/src/styles/globals.css](packages/ui/src/styles/globals.css) — light in `:root`, dark in `.dark`, mapped to Tailwind utilities via `@theme inline`. Ships with the neutral shadcn default palette; swap the token values there to rebrand.

- **Prefer semantic tokens** (`bg-background`, `text-foreground`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`, `border-border`) over raw color utilities so components stay theme-aware in light and dark.
- Charts use `--chart-1` through `--chart-5`.

## Conventions

- **Formatting** (`.prettierrc`): no semicolons, double quotes, 2-space tabs, 80-col, `es5` trailing commas. `prettier-plugin-tailwindcss` sorts classes; `cn` and `cva` are registered as class-bearing functions.
- Path alias in `apps/web`: `@/*` → app root. shadcn aliases (`components.json`): `ui` → `@workspace/ui/components`, `utils` → `@workspace/ui/lib/utils`.
- Use `cn()` from `@workspace/ui/lib/utils` for conditional classes.
