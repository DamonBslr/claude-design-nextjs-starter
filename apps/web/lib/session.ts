import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

/**
 * Per-request memoized session lookup. Multiple Server Components (sidebar
 * footer, header) can each call this in their own Suspense boundary while
 * sharing one database-backed session lookup per render pass.
 */
export const getCachedSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
)
