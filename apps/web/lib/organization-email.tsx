import "server-only"

import { Resend } from "resend"

import { OrganizationInvitationEmail } from "@/emails/organization-invitation"

export class OrganizationInvitationDeliveryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrganizationInvitationDeliveryError"
  }
}

export async function sendOrganizationInvitationEmail(data: {
  email: string
  expiresAt?: Date
  id: string
  invitation: { expiresAt: Date }
  inviter: { user: { email: string; name: string } }
  organization: { name: string }
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const origin = process.env.BETTER_AUTH_URL

  if (!apiKey || !from || !origin) {
    throw new OrganizationInvitationDeliveryError(
      "Invitation email is not configured. Set RESEND_API_KEY, RESEND_FROM_EMAIL, and BETTER_AUTH_URL."
    )
  }

  const acceptUrl = new URL(
    `/accept-invitation/${encodeURIComponent(data.id)}`,
    origin
  ).toString()
  const expiresAt = data.expiresAt ?? data.invitation.expiresAt
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send(
    {
      from,
      to: data.email,
      subject: `Join ${data.organization.name} in Planwise`,
      react: OrganizationInvitationEmail({
        acceptUrl,
        invitedByEmail: data.inviter.user.email,
        invitedByName: data.inviter.user.name,
        organizationName: data.organization.name,
      }),
    },
    {
      idempotencyKey: `organization-invitation/${data.id}/${expiresAt.getTime()}`,
    }
  )

  if (error) {
    throw new OrganizationInvitationDeliveryError(
      "The invitation was created, but the email could not be delivered."
    )
  }
}
