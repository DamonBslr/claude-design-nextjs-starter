# @workspace/db

Neon Postgres via [Drizzle ORM](https://orm.drizzle.team/) using the [Neon serverless HTTP driver](https://neon.com/docs/guides/drizzle).

## Setup

1. Create a [Neon](https://console.neon.tech) project and copy the connection string from **Connect**.
2. Add it to `apps/web/.env.local`:

   ```env
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
   ```

## Schema and migrations

The Better Auth tables are defined in `src/schema/auth.ts`. Define other app
tables under `src/schema/` and re-export them from `src/schema/index.ts`.

From the repo root:

```bash
bun run db:generate   # SQL in packages/db/drizzle/
bun run db:migrate    # apply to Neon
```

Run both commands after cloning before using sign-in or sign-up.

Other commands (run from root via Turbo, or in `packages/db`):

- `bun run db:push` — push schema directly (dev only)
- `bun run db:studio` — Drizzle Studio

## Usage in apps

Server Components and Server Actions only:

```ts
import { db } from "@workspace/db/client"
import * as schema from "@workspace/db/schema"
```

Do not import `@workspace/db/client` from Client Components.
