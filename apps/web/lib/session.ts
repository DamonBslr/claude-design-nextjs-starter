import { cache } from "react"

import { getSession } from "@sezaba/auth/server"

/**
 * Per-request memoized session lookup. Multiple Server Components (sidebar
 * footer, header) can each call this in their own Suspense boundary without
 * triggering more than one fetch to the auth server per request.
 */
export const getCachedSession = cache(getSession)
