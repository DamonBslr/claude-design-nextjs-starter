import type { Session } from "./types";

/**
 * Builds a `Cookie` request header from the current Next.js request.
 * Prefer this over `headers().get("cookie")`, which is often empty in RSC.
 */
async function resolveCookieHeader(headers?: Headers): Promise<string> {
	try {
		const { cookies } = await import("next/headers");
		const store = await cookies();
		const fromStore = store
			.getAll()
			.map(({ name, value }) => `${name}=${value}`)
			.join("; ");
		if (fromStore) {
			return fromStore;
		}
	} catch {
		// Not in a Next.js request context (e.g. scripts, tests).
	}

	return headers?.get("cookie") ?? "";
}

const UNREACHABLE_AUTH_CODES = new Set([
	"ECONNREFUSED",
	"ECONNRESET",
	"ENOTFOUND",
	"EHOSTUNREACH",
]);

function isAuthUnreachable(error: unknown): boolean {
	const visit = (err: unknown): boolean => {
		if (!err || typeof err !== "object") {
			return false;
		}
		if (
			"code" in err &&
			typeof err.code === "string" &&
			UNREACHABLE_AUTH_CODES.has(err.code)
		) {
			return true;
		}
		if (err instanceof Error && err.cause) {
			return visit(err.cause);
		}
		if ("errors" in err && Array.isArray((err as AggregateError).errors)) {
			return (err as AggregateError).errors.some(visit);
		}
		return false;
	};
	return visit(error);
}

/**
 * Fetches the current session from the central auth server.
 *
 * In Next.js App Router, call without arguments from Server Components —
 * cookies are read via `next/headers`. For Route Handlers, pass `request.headers`.
 *
 * Returns `null` when the user is not signed in, the session has expired,
 * or the auth server can't be reached.
 */
export async function getSession(headers?: Headers): Promise<Session | null> {
	const authUrl =
		process.env.AUTH_URL ||
		process.env.NEXT_PUBLIC_AUTH_URL ||
		"http://localhost:3001";
	const cookieHeader = await resolveCookieHeader(headers);

	if (!cookieHeader) {
		return null;
	}

	try {
		try {
			const { unstable_noStore } = await import("next/cache");
			unstable_noStore();
		} catch {
			// Not in a Next.js request context (e.g. scripts, tests).
		}

		const res = await fetch(`${authUrl}/api/auth/get-session`, {
			headers: {
				cookie: cookieHeader,
			},
		});

		if (!res.ok) {
			return null;
		}

		// Better Auth returns `null` (with 200 OK) when there is no session.
		const text = await res.text();
		if (!text || text === "null") {
			return null;
		}

		const data = JSON.parse(text) as Session | null;
		return data?.user ? data : null;
	} catch (error) {
		if (!isAuthUnreachable(error)) {
			console.error("[@sezaba/auth] Failed to get session:", error);
		}
		return null;
	}
}
