import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { AUTH_CALLBACK_HEADER } from "@/lib/auth-config"
import { safeCallbackURL } from "@/lib/safe-callback-url"
import { selectActiveOrganization } from "@/lib/organization-validation"
import type {
  OrganizationContext,
  OrganizationSummary,
} from "@/lib/features/organizations/types"

/**
 * Per-request memoized session lookup. Multiple Server Components can share
 * one database-backed lookup during a render pass.
 */
export const getCachedSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
)

function mapOrganization(organization: {
  description?: string | null
  id: string
  name: string
}): OrganizationSummary {
  return {
    description: organization.description ?? null,
    id: organization.id,
    name: organization.name,
  }
}

export const getCachedOrganizationContext = cache(async () => {
  const session = await getCachedSession()
  if (!session) return null

  const organizations = (
    await auth.api.listOrganizations({ headers: await headers() })
  ).map(mapOrganization)
  const sessionOrganizationId = session.session.activeOrganizationId
  const activeOrganization = selectActiveOrganization(
    organizations,
    sessionOrganizationId
  )

  return {
    activeOrganization,
    needsActivation:
      activeOrganization !== null &&
      activeOrganization.id !== sessionOrganizationId,
    organizations,
    session,
  }
})

/**
 * Secure, database-backed guard for protected Server Components.
 * The proxy only performs the earlier optimistic cookie-presence check.
 */
export async function requireSession(callbackURL?: string) {
  const session = await getCachedSession()

  if (!session) {
    const requestedURL =
      callbackURL ?? (await headers()).get(AUTH_CALLBACK_HEADER) ?? "/"
    const safeURL = safeCallbackURL(requestedURL)

    redirect(`/sign-in?callbackURL=${encodeURIComponent(safeURL)}`)
  }

  return session
}

/**
 * Secure organization guard for protected Server Components. Membership is
 * loaded from Better Auth on every render pass rather than trusted from a
 * client-provided organization id.
 */
export async function requireOrganization(callbackURL?: string): Promise<
  OrganizationContext & {
    session: NonNullable<Awaited<ReturnType<typeof getCachedSession>>>
  }
> {
  const context = await getCachedOrganizationContext()

  if (!context) {
    await requireSession(callbackURL)
    throw new Error("Unreachable after authentication redirect")
  }

  if (!context.activeOrganization) {
    const requestedURL =
      callbackURL ?? (await headers()).get(AUTH_CALLBACK_HEADER) ?? "/"
    const safeURL = safeCallbackURL(requestedURL)

    redirect(
      `/onboarding/organization?callbackURL=${encodeURIComponent(safeURL)}`
    )
  }

  return {
    activeOrganization: context.activeOrganization,
    needsActivation: context.needsActivation,
    organizations: context.organizations,
    session: context.session,
  }
}
