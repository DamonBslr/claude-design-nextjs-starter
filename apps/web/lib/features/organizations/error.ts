import type { OrganizationActionResult } from "@/lib/features/organizations/types"

export function organizationActionError(
  status: OrganizationActionResult["status"],
  message: string,
  fieldErrors?: Record<string, string>
): OrganizationActionResult {
  return { fieldErrors, message, status }
}

function getErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { code: "", message: "" }
  }

  const value = error as {
    body?: { code?: string; message?: string }
    code?: string
    message?: string
  }

  return {
    code: value.body?.code ?? value.code ?? "",
    message: value.body?.message ?? value.message ?? "",
  }
}

export function mapOrganizationError(error: unknown): OrganizationActionResult {
  const { code, message } = getErrorDetails(error)
  const normalized = `${code} ${message}`.toUpperCase()

  if (
    normalized.includes("NOT_FOUND") ||
    normalized.includes("NOT FOUND") ||
    normalized.includes("EXPIRED") ||
    normalized.includes("CANCELED") ||
    normalized.includes("CANCELLED")
  ) {
    return organizationActionError(
      "not_found",
      "This invitation is invalid or expired."
    )
  }

  if (
    normalized.includes("NOT_ALLOWED") ||
    normalized.includes("NOT ALLOWED") ||
    normalized.includes("RECIPIENT") ||
    normalized.includes("EMAIL_MISMATCH") ||
    normalized.includes("FORBIDDEN")
  ) {
    return organizationActionError(
      "forbidden",
      "You do not have permission to perform this action."
    )
  }

  if (
    normalized.includes("RESEND") ||
    (normalized.includes("EMAIL") && normalized.includes("INVITATION"))
  ) {
    return organizationActionError(
      "provider",
      "The invitation is pending, but its email could not be delivered. You can resend it after email is configured."
    )
  }

  if (
    normalized.includes("ALREADY") ||
    normalized.includes("LIMIT") ||
    normalized.includes("CANNOT") ||
    normalized.includes("CONFLICT") ||
    normalized.includes("FULL")
  ) {
    return organizationActionError(
      "conflict",
      message || "This action conflicts with existing organization data."
    )
  }

  return organizationActionError(
    "unexpected",
    "The organization action could not be completed. Try again."
  )
}

export function mapInvitationAcceptanceState(input: {
  alreadyMember: boolean
  email: string
  expiresAt: Date
  memberCount: number
  now?: Date
  status: string
  userEmail: string
}): OrganizationActionResult | null {
  if (input.status === "accepted") {
    return organizationActionError(
      "conflict",
      "This invitation has already been used. Open the application to continue."
    )
  }

  if (input.status !== "pending") {
    return organizationActionError(
      "not_found",
      "This invitation was canceled or is no longer active."
    )
  }

  if (input.expiresAt <= (input.now ?? new Date())) {
    return organizationActionError(
      "not_found",
      "This invitation has expired. Ask an organization owner or admin to resend it."
    )
  }

  if (input.email.toLowerCase() !== input.userEmail.toLowerCase()) {
    return organizationActionError(
      "forbidden",
      `Sign in with ${input.email} to accept this invitation.`
    )
  }

  if (input.alreadyMember) {
    return organizationActionError(
      "conflict",
      "You are already a member of this organization."
    )
  }

  if (input.memberCount >= 100) {
    return organizationActionError(
      "conflict",
      "This organization has reached its 100-member limit."
    )
  }

  return null
}
