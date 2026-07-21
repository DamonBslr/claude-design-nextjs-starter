# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This repo runs **Next.js 16** with breaking changes from earlier versions you may know (e.g. Middleware is renamed to **Proxy** — `proxy.ts` with a `proxy` function, not `middleware.ts`). Before writing Next.js code, read the relevant guide in `apps/web/node_modules/next/dist/docs/` and heed deprecation notices. Do not assume App Router conventions from training data carry over.

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
```

To run a single workspace task directly, `cd` into it and run its script (e.g. `cd apps/web && bun run dev`), or use `turbo dev --filter=web`.

Adding shadcn components (places them in `packages/ui/src/components/`, not the app):

```bash
bunx shadcn@latest add <component> -c apps/web
```

There is no test runner configured in this repo.

## Architecture

Turborepo monorepo (`apps/*`, `packages/*`). One app today (`apps/web`), with shared logic factored into workspace packages consumed via `workspace:*`.

- **`apps/web`** — the Next.js 16 app. `next.config.ts` sets `turbopack.root` to the monorepo root and `transpilePackages` for `@workspace/ui` and `@sezaba/auth` (workspace packages ship raw `.ts`/`.tsx`, so consuming apps must transpile them).
- **`packages/ui`** (`@workspace/ui`) — shared shadcn/ui component library. Exports `./components/*`, `./hooks/*`, `./lib/*`, and `./globals.css`. **All UI primitives live here** — compose app UI from these, do not write one-off primitives in the app.
- **`packages/auth`** (`@sezaba/auth`) — Better Auth client wrapper (details below).
- **`packages/db`** (`@workspace/db`) — Neon Postgres + Drizzle ORM.
- **`packages/eslint-config`**, **`packages/typescript-config`** — shared config consumed by every workspace's local `eslint.config.js` / `tsconfig.json`.

### Authentication (`@sezaba/auth`)

Apps do **not** run their own auth server. They authenticate against a central Better Auth server at `auth.sezaba.de`, which sets a session cookie scoped to `.sezaba.de` (cross-subdomain). New consumer apps need their origin added to the auth server's `TRUSTED_ORIGINS` and must share its `BETTER_AUTH_SECRET`.

Two-layer auth pattern — both are required:
1. **Proxy** (`apps/web/proxy.ts`) — `createAuthProxy` does an *optimistic, network-free* cookie-presence check and redirects to the central sign-in page if absent. This is **not secure on its own** (cookies can be forged) and only gates routing. Scope it with the `matcher` config.
2. **Real validation** in pages/route handlers via `getSession()` from `@sezaba/auth/server`, which actually calls the auth server. In Server Components call it with no args (cookies read from `next/headers`); in Route Handlers pass `request.headers`.

In `apps/web`, use `getCachedSession` from [apps/web/lib/session.ts](apps/web/lib/session.ts) — a React `cache()`-wrapped `getSession` so multiple Suspense boundaries (sidebar, header) share one fetch per request.

Client side: import `signIn`/`signOut`/`useSession` from `@sezaba/auth/client`. Env vars: `NEXT_PUBLIC_AUTH_URL` (client), `AUTH_URL` (server, takes precedence). See [packages/auth/README.md](packages/auth/README.md).

### Database (`@workspace/db`)

Neon serverless HTTP driver + Drizzle. Import only from **Server Components / Server Actions** — never from Client Components:

```ts
import { db } from "@workspace/db/client"
import * as schema from "@workspace/db/schema"
```

Define tables under `packages/db/src/schema/` and re-export from `src/schema/index.ts`. Generated migrations land in `packages/db/drizzle/`. `DATABASE_URL` lives in `apps/web/.env.local`.

## Sezaba CI styling (enforced)

All UI uses a **fixed 6-color palette** with no exceptions. This is a hard rule, not a preference. Theme source: [packages/ui/src/styles/globals.css](packages/ui/src/styles/globals.css). Full docs: [STYLEGUIDE.md](STYLEGUIDE.md), enforced via [.cursor/rules/brand-styling.mdc](.cursor/rules/brand-styling.mdc).

Palette: `brand-black`, `brand-white`, `brand-beige`, `brand-pink`, `brand-red` (**default accent — CTAs, charts, destructive**), `brand-blue` (secondary accent). Dark mode inverts black↔white via CSS variables; accents stay constant.

- **Prefer semantic tokens** (`bg-background`, `text-foreground`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`) over raw brand utilities, so components stay theme-aware.
- Charts: `--chart-1` (red) through `--chart-5` (beige); use red first.
- **Forbidden:** raw hex in TSX/CSS, Tailwind default palettes (`blue-500`, `zinc-200`, `gray-*`), any new color, or blue as the default button/link color. For UI chrome use opacity on brand/semantic tokens (`bg-primary/80`, `border-border`, `text-muted-foreground`) — never invent new grays.

## Conventions

- **Formatting** (`.prettierrc`): no semicolons, double quotes, 2-space tabs, 80-col, `es5` trailing commas. `prettier-plugin-tailwindcss` sorts classes; `cn` and `cva` are registered as class-bearing functions.
- Note `packages/auth/` uses **biome** (tabs, `biome.json`) rather than the repo prettier config.
- Path alias in `apps/web`: `@/*` → app root. shadcn aliases (`components.json`): `ui` → `@workspace/ui/components`, `utils` → `@workspace/ui/lib/utils`.
- Use `cn()` from `@workspace/ui/lib/utils` for conditional classes.
