export const ORGANIZATION_NAME_MAX_LENGTH = 100
export const ORGANIZATION_DESCRIPTION_MAX_LENGTH = 1000

export const ORGANIZATION_ROLES = ["owner", "admin", "member"] as const
export const INVITABLE_ORGANIZATION_ROLES = ["admin", "member"] as const

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number]
export type InvitableOrganizationRole =
  (typeof INVITABLE_ORGANIZATION_ROLES)[number]

export function normalizeOrganizationRole(value: string): OrganizationRole {
  const roles = value
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean)

  if (roles.includes("owner")) return "owner"
  if (roles.includes("admin")) return "admin"
  return "member"
}

export function canManageOrganization(role: OrganizationRole) {
  return role === "owner" || role === "admin"
}

export function selectActiveOrganization<Organization extends { id: string }>(
  organizations: Organization[],
  activeOrganizationId: string | null | undefined
) {
  return (
    organizations.find(
      (organization) => organization.id === activeOrganizationId
    ) ??
    organizations[0] ??
    null
  )
}

export function createOrganizationSlug(name: string, suffix: string) {
  const base = name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)

  return `${base || "organization"}-${suffix
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8)}`
}

export function validateOrganizationDetails(input: {
  description: string
  name: string
}) {
  const name = input.name.trim()
  const description = input.description.trim()
  const fieldErrors: { description?: string; name?: string } = {}

  if (!name) {
    fieldErrors.name = "Organization name is required."
  } else if (name.length > ORGANIZATION_NAME_MAX_LENGTH) {
    fieldErrors.name = `Use ${ORGANIZATION_NAME_MAX_LENGTH} characters or fewer.`
  }

  if (description.length > ORGANIZATION_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description = `Use ${ORGANIZATION_DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }

  return {
    data: { description: description || undefined, name },
    fieldErrors,
    success: Object.keys(fieldErrors).length === 0,
  }
}

export function validateOrganizationPatch(input: {
  description?: string | null
  name?: string
}) {
  const data: { description?: string | null; name?: string } = {}
  const fieldErrors: { description?: string; name?: string } = {}

  if (input.name !== undefined) {
    const name = input.name.trim()
    if (!name) {
      fieldErrors.name = "Organization name is required."
    } else if (name.length > ORGANIZATION_NAME_MAX_LENGTH) {
      fieldErrors.name = `Use ${ORGANIZATION_NAME_MAX_LENGTH} characters or fewer.`
    } else {
      data.name = name
    }
  }

  if (input.description !== undefined) {
    const description = input.description?.trim() ?? ""
    if (description.length > ORGANIZATION_DESCRIPTION_MAX_LENGTH) {
      fieldErrors.description = `Use ${ORGANIZATION_DESCRIPTION_MAX_LENGTH} characters or fewer.`
    } else {
      data.description = description || null
    }
  }

  return {
    data,
    fieldErrors,
    success: Object.keys(fieldErrors).length === 0,
  }
}

export function isInvitableOrganizationRole(
  value: string
): value is InvitableOrganizationRole {
  return INVITABLE_ORGANIZATION_ROLES.some((role) => role === value)
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
