import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

import { buildSignInUrl, getAuthBaseUrl } from "./urls";

export interface AuthProxyOptions {
	/** URL of the central auth app, e.g. https://auth.sezaba.de. */
	authUrl?: string;
	/** Paths that should bypass the auth check entirely. */
	publicPaths?: string[];
	/** Override the callback URL sent to the auth app. Defaults to the current request URL. */
	callbackUrl?: string;
	/** Cookie prefix configured on the auth server (default: "better-auth"). */
	cookiePrefix?: string;
}

/**
 * Lightweight Next.js 16 proxy (formerly "middleware") that gates access to a
 * consumer app behind the central Better Auth server.
 *
 * Following the Better Auth recommendation, this performs an *optimistic*
 * cookie-presence check only (no network or database call) using
 * `getSessionCookie`, which transparently handles the `__Secure-` prefix in
 * production. If the cookie is missing the user is redirected to
 * `${authUrl}/sign-in?callbackURL=…`.
 *
 * This check is NOT secure on its own — anyone can forge a cookie. Real session
 * validation must happen in the page / route handler via `getSession()` from
 * `@sezaba/auth/server`. Scope the proxy to protected routes using the
 * `matcher` config in your app's `proxy.ts`.
 *
 * @see https://better-auth.com/docs/integrations/next#auth-protection
 */
export function createAuthProxy(options: AuthProxyOptions = {}) {
	const {
		authUrl = getAuthBaseUrl(),
		publicPaths = [],
		callbackUrl,
		cookiePrefix = "better-auth",
	} = options;

	return function proxy(request: NextRequest) {
		const { pathname } = request.nextUrl;

		if (publicPaths.some((path) => pathname.startsWith(path))) {
			return NextResponse.next();
		}

		const sessionCookie = getSessionCookie(request, { cookiePrefix });

		if (!sessionCookie) {
			const callback =
				callbackUrl ||
				`${request.nextUrl.origin}${request.nextUrl.pathname}${request.nextUrl.search}`;
			return NextResponse.redirect(buildSignInUrl(callback, authUrl));
		}

		return NextResponse.next();
	};
}
