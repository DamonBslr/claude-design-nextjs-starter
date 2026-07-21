/** Base URL of the central Better Auth app. */
export function getAuthBaseUrl(): string {
	const base =
		process.env.AUTH_URL ||
		process.env.NEXT_PUBLIC_AUTH_URL ||
		"http://localhost:3001";
	return base.replace(/\/$/, "");
}

/** Full URL for the central auth app's sign-in page with a post-login callback. */
export function buildSignInUrl(callbackUrl: string, authUrl?: string): string {
	const base = authUrl ?? getAuthBaseUrl();
	const url = new URL(`${base}/sign-in`);
	url.searchParams.set("callbackURL", callbackUrl);
	return url.href;
}
