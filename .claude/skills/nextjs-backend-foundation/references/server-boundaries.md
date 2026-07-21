# Server and security boundaries

## Runtime ownership

- `packages/ui`: client-safe presentation only.
- `apps/web/app`: Server Components by default; small Client Components for
  interaction.
- `apps/web/lib/features`: server-only data access and business rules.
- `packages/db`: Neon/Drizzle client and schema.
- `apps/web/lib/auth.ts`: local Better Auth server backed by `packages/db`.

## Data access

- Import `@workspace/db/client` only from server modules.
- This app initializes Drizzle as part of the local Better Auth server, so
  `DATABASE_URL` must be available to `next build` and at runtime.
- Use Neon HTTP for one-shot serverless queries. Choose a transaction-capable
  approach only when the feature truly requires interactive transactions.
- Never send raw Drizzle rows to Client Components; map to narrow view models.

## Authentication and authorization

- `proxy.ts` may redirect based on cookie presence; it is not authorization.
- Validate the session in protected Server Components, Server Actions, and Route
  Handlers.
- Treat Server Actions and Route Handlers as public entry points.
- Derive actor ID and roles from the validated session.
- Scope each user-owned query by actor ID and verify resource ownership on writes.
- Use Client `useSession()` for display state only.

## Secrets

- `DATABASE_URL`, `BETTER_AUTH_SECRET`, provider API keys, and webhook secrets remain
  server-only.
- Only browser-required base URLs may use `NEXT_PUBLIC_`.
- Commit `.env.example`; never commit `.env` or `.env.local`.

## Operation choice

- Server Component: authenticated read for page rendering.
- Server Action: mutation initiated by this app's UI.
- Route Handler: webhook, external API consumer, stream, or file transfer.
- Background/durable work: use an explicitly selected server-side job system;
  never keep work alive with an unawaited promise in a request.
