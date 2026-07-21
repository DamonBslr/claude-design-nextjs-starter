import { getSessionCookie } from "better-auth/cookies"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_PREFIX } from "@/lib/auth-config"

export function proxy(request: NextRequest) {
  if (!getSessionCookie(request, { cookiePrefix: AUTH_COOKIE_PREFIX })) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set(
      "callbackURL",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    )
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Auth endpoints and sign-in/up pages remain public. Protected pages still
  // perform a real database-backed session check close to their data.
  matcher: [
    "/((?!api/auth|api/health|sign-in|sign-up|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js).*)",
  ],
}
