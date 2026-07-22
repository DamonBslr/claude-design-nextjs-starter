import { redirect } from "next/navigation"

import { OrganizationSetupForm } from "@/components/organization-setup-form"
import { safeCallbackURL } from "@/lib/safe-callback-url"
import { getCachedOrganizationContext, requireSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function OrganizationOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackURL?: string | string[]
    new?: string | string[]
  }>
}) {
  const params = await searchParams
  const callbackURL = safeCallbackURL(params.callbackURL)
  await requireSession(
    `/onboarding/organization?callbackURL=${encodeURIComponent(callbackURL)}`
  )
  const context = await getCachedOrganizationContext()
  const isCreatingAnother =
    (Array.isArray(params.new) ? params.new[0] : params.new) === "1"

  if (context?.activeOrganization && !isCreatingAnother) {
    redirect(callbackURL)
  }

  return <OrganizationSetupForm callbackURL={callbackURL} />
}
