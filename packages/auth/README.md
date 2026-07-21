# @sezaba/auth

Shared authentication client for `*.sezaba.de` apps. It talks to the
central [Better Auth](https://www.better-auth.com) server hosted at
`auth.sezaba.de`.

## How sign-in actually works

1. The user hits a protected route on (e.g.) `docs.sezaba.de`.
2. The middleware sees no session cookie and redirects to
   `https://auth.sezaba.de/sign-in?callbackURL=https://docs.sezaba.de/...`.
3. The auth app signs the user in and sets a cookie on **`.sezaba.de`**
   (not on `auth.sezaba.de`). This requires
   `advanced.crossSubDomainCookies` to be enabled on the auth server — see
   the auth server's `lib/auth.ts`.
4. The browser navigates back to the callback URL. Because the cookie is
   scoped to `.sezaba.de`, the consumer app now sees it on the very
   first request, the middleware lets the request through, and
   `getSession()` returns a real session.

If a consumer app is "signing in but immediately bouncing back to auth",
99% of the time the auth server is missing `crossSubDomainCookies` or the
consumer's origin is missing from `trustedOrigins`.

## Requirements on the auth server (`auth.sezaba.de`)

```ts
// lib/auth.ts on the auth app
betterAuth({
  // Driven by the TRUSTED_ORIGINS env var (comma-separated). e.g.
  // TRUSTED_ORIGINS=https://sezaba.de,https://*.sezaba.de
  trustedOrigins,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".sezaba.de",
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: true,
    },
  },
});
```

When you add a new consumer subdomain, just append its origin to
`TRUSTED_ORIGINS` on the auth app — no code change needed.

Both the auth server and every consumer app **must share the same
`BETTER_AUTH_SECRET`** — the cookie is signed with it.

## Usage

### Client-side (React)

```typescript
import { signIn, signUp, signOut, useSession } from "@sezaba/auth/client";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) {
    // Send the user to the central auth app, preserving where they were.
    const callbackURL = encodeURIComponent(window.location.href);
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/sign-in?callbackURL=${callbackURL}`;
    return null;
  }

  return <button onClick={() => signOut()}>Sign Out {session.user.email}</button>;
}
```

### Server-side

```typescript
import { getSession } from "@sezaba/auth/server";
import { headers } from "next/headers";

export async function GET() {
  // In App Router Server Components, `getSession()` with no args is enough.
  // In Route Handlers, pass `request.headers`.
  const session = await getSession(await headers());
  if (!session) return new Response("Unauthorized", { status: 401 });
  // session.user, session.session …
}
```

### Proxy (Next.js 16+)

Next.js 16 renames Middleware to **Proxy** (`proxy.ts` with a `proxy`
function). Scope the `matcher` to the routes you actually want to protect.

```typescript
// proxy.ts in the consumer app
import { createAuthProxy } from "@sezaba/auth/proxy";

export const proxy = createAuthProxy({
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
});

export const config = {
  // Only protected routes — everything else stays public.
  matcher: ["/account/:path*"],
};
```

The proxy does an **optimistic** cookie-presence check using
`getSessionCookie` from better-auth (so it correctly handles the
`__Secure-` prefix in production). This is **not secure on its own** — it
does **not** call the auth server. Always do real validation in your
route/page handler with `getSession()` to gate on user data or roles.

See the [Better Auth Next.js auth protection guide](https://better-auth.com/docs/integrations/next#auth-protection).

## Environment variables (consumer app)

```env
# Used by the React client (must be public)
NEXT_PUBLIC_AUTH_URL=https://auth.sezaba.de

# Used by the server-side getSession() helper. AUTH_URL takes precedence
# if both are set; falls back to NEXT_PUBLIC_AUTH_URL.
AUTH_URL=https://auth.sezaba.de

# Same secret as the auth server (only required if you ever decode the
# cookie cache locally; not needed for getSession()).
BETTER_AUTH_SECRET=…
```
