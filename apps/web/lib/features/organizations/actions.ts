"use server"

import { and, count, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { db } from "@workspace/db/client"
import { invitation, member } from "@workspace/db/schema"

import { auth } from "@/lib/auth"
import {
  mapInvitationAcceptanceState,
  mapOrganizationError,
  organizationActionError,
} from "@/lib/features/organizations/error"
import type { OrganizationActionResult } from "@/lib/features/organizations/types"
import { sendOrganizationInvitationEmail } from "@/lib/organization-email"
import {
  canManageOrganization,
  createOrganizationSlug,
  isInvitableOrganizationRole,
  isValidEmail,
  normalizeOrganizationRole,
  validateOrganizationDetails,
} from "@/lib/organization-validation"
import { safeCallbackURL } from "@/lib/safe-callback-url"

type ActionContext = {
  organizationId: string
  organizationName: string
  role: ReturnType<typeof normalizeOrganizationRole>
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
}

const actionError = organizationActionError

async function getActionContext(): Promise<
  { context: ActionContext } | { error: OrganizationActionResult }
> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    return {
      error: actionError("unauthorized", "Sign in to continue."),
    }
  }

  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })
  const organization =
    organizations.find(
      (candidate) => candidate.id === session.session.activeOrganizationId
    ) ?? organizations[0]

  if (!organization) {
    return {
      error: actionError(
        "forbidden",
        "Create or join an organization to continue."
      ),
    }
  }

  const currentMember = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, organization.id),
      eq(member.userId, session.user.id)
    ),
  })

  if (!currentMember) {
    return {
      error: actionError(
        "forbidden",
        "Your organization membership is no longer valid."
      ),
    }
  }

  return {
    context: {
      organizationId: organization.id,
      organizationName: organization.name,
      role: normalizeOrganizationRole(currentMember.role),
      session,
    },
  }
}

async function getManagerContext() {
  const result = await getActionContext()
  if ("error" in result) return result

  if (!canManageOrganization(result.context.role)) {
    return {
      error: actionError(
        "forbidden",
        "Only organization owners and admins can perform this action."
      ),
    }
  }

  return result
}

function revalidateOrganizationUI() {
  revalidatePath("/organization")
  revalidatePath("/", "layout")
}

async function confirmInvitationDelivery(
  invitationData: { email: string; expiresAt: Date; id: string },
  context: ActionContext
) {
  // Better Auth deliberately swallows hook errors. Repeating the same send
  // here makes delivery observable to the action; Resend deduplicates it by
  // the invitation ID/expiry key when the hook already succeeded.
  await sendOrganizationInvitationEmail({
    email: invitationData.email,
    id: invitationData.id,
    invitation: { expiresAt: invitationData.expiresAt },
    inviter: {
      user: {
        email: context.session.user.email,
        name: context.session.user.name,
      },
    },
    organization: { name: context.organizationName },
  })
}

export async function createOrganizationAction(
  _previousState: OrganizationActionResult,
  formData: FormData
): Promise<OrganizationActionResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    return actionError("unauthorized", "Sign in to create an organization.")
  }

  const validation = validateOrganizationDetails({
    description: String(formData.get("description") ?? ""),
    name: String(formData.get("name") ?? ""),
  })

  if (!validation.success) {
    return actionError(
      "validation",
      "Check the organization details.",
      validation.fieldErrors
    )
  }

  const callbackURL = safeCallbackURL(
    String(formData.get("callbackURL") ?? "/")
  )
  const slug = createOrganizationSlug(validation.data.name, crypto.randomUUID())

  try {
    await auth.api.createOrganization({
      body: {
        description: validation.data.description,
        name: validation.data.name,
        slug,
      },
      headers: requestHeaders,
    })
    revalidateOrganizationUI()
    return { redirectTo: callbackURL, status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}

export async function updateOrganizationAction(
  _previousState: OrganizationActionResult,
  formData: FormData
): Promise<OrganizationActionResult> {
  const result = await getManagerContext()
  if ("error" in result) return result.error

  const validation = validateOrganizationDetails({
    description: String(formData.get("description") ?? ""),
    name: String(formData.get("name") ?? ""),
  })

  if (!validation.success) {
    return actionError(
      "validation",
      "Check the organization details.",
      validation.fieldErrors
    )
  }

  try {
    await auth.api.updateOrganization({
      body: {
        data: {
          description: validation.data.description ?? "",
          name: validation.data.name,
        },
        organizationId: result.context.organizationId,
      },
      headers: await headers(),
    })
    revalidateOrganizationUI()
    return { message: "Organization details updated.", status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}

export async function inviteOrganizationMemberAction(
  _previousState: OrganizationActionResult,
  formData: FormData
): Promise<OrganizationActionResult> {
  const result = await getManagerContext()
  if ("error" in result) return result.error

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const role = String(formData.get("role") ?? "member")

  if (!isValidEmail(email) || !isInvitableOrganizationRole(role)) {
    return actionError("validation", "Enter a valid email and role.", {
      ...(!isValidEmail(email)
        ? { email: "Enter a valid email address." }
        : {}),
      ...(!isInvitableOrganizationRole(role)
        ? { role: "Choose member or admin." }
        : {}),
    })
  }

  try {
    const createdInvitation = await auth.api.createInvitation({
      body: {
        email,
        organizationId: result.context.organizationId,
        role,
      },
      headers: await headers(),
    })
    await confirmInvitationDelivery(createdInvitation, result.context)
    revalidateOrganizationUI()
    return { message: `Invitation sent to ${email}.`, status: "success" }
  } catch (error) {
    revalidateOrganizationUI()
    return mapOrganizationError(error)
  }
}

export async function resendOrganizationInvitationAction(
  invitationId: string
): Promise<OrganizationActionResult> {
  const result = await getManagerContext()
  if ("error" in result) return result.error

  const pendingInvitation = await db.query.invitation.findFirst({
    where: and(
      eq(invitation.id, invitationId),
      eq(invitation.organizationId, result.context.organizationId),
      eq(invitation.status, "pending")
    ),
  })

  if (!pendingInvitation) {
    return actionError("not_found", "The pending invitation was not found.")
  }

  if (!isInvitableOrganizationRole(pendingInvitation.role)) {
    return actionError("validation", "The invitation has an unsupported role.")
  }

  try {
    const resentInvitation = await auth.api.createInvitation({
      body: {
        email: pendingInvitation.email,
        organizationId: result.context.organizationId,
        resend: true,
        role: pendingInvitation.role,
      },
      headers: await headers(),
    })
    await confirmInvitationDelivery(resentInvitation, result.context)
    revalidateOrganizationUI()
    return { message: "Invitation resent.", status: "success" }
  } catch (error) {
    revalidateOrganizationUI()
    return mapOrganizationError(error)
  }
}

export async function cancelOrganizationInvitationAction(
  invitationId: string
): Promise<OrganizationActionResult> {
  const result = await getManagerContext()
  if ("error" in result) return result.error

  const pendingInvitation = await db.query.invitation.findFirst({
    where: and(
      eq(invitation.id, invitationId),
      eq(invitation.organizationId, result.context.organizationId),
      eq(invitation.status, "pending")
    ),
  })

  if (!pendingInvitation) {
    return actionError("not_found", "The pending invitation was not found.")
  }

  try {
    await auth.api.cancelInvitation({
      body: { invitationId },
      headers: await headers(),
    })
    revalidateOrganizationUI()
    return { message: "Invitation canceled.", status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}

export async function updateOrganizationMemberRoleAction(
  memberId: string,
  role: string
): Promise<OrganizationActionResult> {
  const result = await getManagerContext()
  if ("error" in result) return result.error

  if (!isInvitableOrganizationRole(role)) {
    return actionError("validation", "Choose member or admin.")
  }

  const targetMember = await db.query.member.findFirst({
    where: and(
      eq(member.id, memberId),
      eq(member.organizationId, result.context.organizationId)
    ),
  })

  if (!targetMember) {
    return actionError("not_found", "The organization member was not found.")
  }

  if (
    targetMember.userId === result.context.session.user.id ||
    normalizeOrganizationRole(targetMember.role) === "owner"
  ) {
    return actionError(
      "forbidden",
      "Owner and current-user role changes are not available here."
    )
  }

  try {
    await auth.api.updateMemberRole({
      body: {
        memberId,
        organizationId: result.context.organizationId,
        role,
      },
      headers: await headers(),
    })
    revalidateOrganizationUI()
    return { message: "Member role updated.", status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}

export async function removeOrganizationMemberAction(
  memberId: string
): Promise<OrganizationActionResult> {
  const result = await getManagerContext()
  if ("error" in result) return result.error

  const targetMember = await db.query.member.findFirst({
    where: and(
      eq(member.id, memberId),
      eq(member.organizationId, result.context.organizationId)
    ),
  })

  if (!targetMember) {
    return actionError("not_found", "The organization member was not found.")
  }

  if (
    targetMember.userId === result.context.session.user.id ||
    normalizeOrganizationRole(targetMember.role) === "owner"
  ) {
    return actionError(
      "forbidden",
      "Owner and current-user removal is not available here."
    )
  }

  try {
    await auth.api.removeMember({
      body: {
        memberIdOrEmail: memberId,
        organizationId: result.context.organizationId,
      },
      headers: await headers(),
    })
    revalidateOrganizationUI()
    return { message: "Member removed.", status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}

export async function setActiveOrganizationAction(
  organizationId: string
): Promise<OrganizationActionResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) return actionError("unauthorized", "Sign in to continue.")

  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })
  if (
    !organizations.some((organization) => organization.id === organizationId)
  ) {
    return actionError(
      "forbidden",
      "You are not a member of that organization."
    )
  }

  try {
    await auth.api.setActiveOrganization({
      body: { organizationId },
      headers: requestHeaders,
    })
    revalidateOrganizationUI()
    return { status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}

export async function acceptOrganizationInvitationAction(
  invitationId: string
): Promise<OrganizationActionResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) return actionError("unauthorized", "Sign in to continue.")

  const pendingInvitation = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId),
  })
  if (!pendingInvitation) {
    return actionError("not_found", "This invitation does not exist.")
  }

  const [memberCountResult, existingMembership] = await Promise.all([
    db
      .select({ value: count() })
      .from(member)
      .where(eq(member.organizationId, pendingInvitation.organizationId)),
    db.query.member.findFirst({
      where: and(
        eq(member.organizationId, pendingInvitation.organizationId),
        eq(member.userId, session.user.id)
      ),
    }),
  ])
  const recoveryState = mapInvitationAcceptanceState({
    alreadyMember: Boolean(existingMembership),
    email: pendingInvitation.email,
    expiresAt: pendingInvitation.expiresAt,
    memberCount: memberCountResult[0]?.value ?? 0,
    status: pendingInvitation.status,
    userEmail: session.user.email,
  })
  if (recoveryState) return recoveryState

  try {
    await auth.api.acceptInvitation({
      body: { invitationId },
      headers: requestHeaders,
    })
    revalidateOrganizationUI()
    return { redirectTo: "/", status: "success" }
  } catch (error) {
    return mapOrganizationError(error)
  }
}
