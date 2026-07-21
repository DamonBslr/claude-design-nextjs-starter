# Claude Design to Next.js starter

A Bun/Turborepo starter for importing a Claude Design handoff, transforming it
into a Next.js 16 App Router app, syncing later design versions, and wiring the
approved backend through Neon/Drizzle and Better Auth.

## Stack

- `apps/web` — Next.js 16 and React 19
- `packages/ui` — shadcn/ui presentation package and design-owned screens
- `packages/db` — Neon Postgres through Drizzle ORM
- Better Auth hosted directly by `apps/web`
- Bun workspaces and Turbo

## Setup

```bash
bun install
cp apps/web/.env.example apps/web/.env.local
bun run dev
```

Add the Neon connection string, app URL, and a unique Better Auth secret to
`.env.local`. Never commit that file. Then apply the generated auth migration:

```bash
bun run db:migrate
```

See `packages/db/README.md` for database details.

## Claude Design workflow

Claude Code commands live in `.claude/commands/`; matching Codex skills live in
`.agents/skills/` and delegate to canonical instructions under `.claude/skills/`.

```text
/import-design <share-url|file|folder|zip>
        ↓ dedicated design import commit
/init-from-design <source>              # first implementation only
        ↓
/sync-design [source] [--to <commit>]   # later design versions
        ↓
/wire-backend [feature]                 # approved server work
```

`design-src/` is a normalized, committed snapshot and may only be written by the
import skill. Incremental sync owns presentation and thin route/TODO adapters;
schema, real data access, and auth rules go through `/wire-backend`.

List pending imports with:

```bash
bun run design:pending
```

## Common commands

```bash
bun run dev
bun run lint
bun run typecheck
bun run build

bun run db:generate   # generate reviewed SQL migrations
bun run db:migrate    # apply migrations (requires explicit target/approval)
bun run db:push       # development databases only
bun run db:studio
```

Add shared shadcn components from the repository root:

```bash
bunx shadcn@latest add button -c apps/web
```
