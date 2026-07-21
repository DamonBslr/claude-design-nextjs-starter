import { createAuthProxy } from "@sezaba/auth/proxy";

export const proxy = createAuthProxy({
	// Keep health checks reachable for load balancers / uptime monitors.
	publicPaths: ["/api/health"],
});

export const config = {
	// Gate the entire app — unauthenticated users are redirected to sign-in.
	// Full session validation still happens in pages via getSession().
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js).*)",
	],
};
