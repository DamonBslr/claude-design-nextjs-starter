import { InvitationAcceptance } from "@/components/invitation-acceptance"
import { requireSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ invitationId: string }>
}) {
  const { invitationId } = await params
  const callbackURL = `/accept-invitation/${encodeURIComponent(invitationId)}`
  await requireSession(callbackURL)

  return <InvitationAcceptance invitationId={invitationId} />
}
