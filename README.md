# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Authentication

The `web` app uses [`@sezaba/auth`](packages/auth/) against the central Better Auth server at `auth.sezaba.de`. Copy env vars and see [packages/auth/README.md](packages/auth/README.md) for cross-subdomain cookie requirements.

```bash
cp apps/web/.env.example apps/web/.env.local
```

Run the app after adding your consumer origin to the auth server's `TRUSTED_ORIGINS`.

## Database

The `web` app can use [`@workspace/db`](packages/db/) (Neon + Drizzle). Copy env vars and see [packages/db/README.md](packages/db/README.md) for connection string and migrations.

```bash
cp apps/web/.env.example apps/web/.env.local
# Add DATABASE_URL from the Neon Console Connect modal
```
