import type {
  InvitableOrganizationRole,
  OrganizationRole,
} from "@/lib/organization-validation"

export type OrganizationSummary = {
  description: string | null
  id: string
  name: string
}

export type OrganizationContext = {
  activeOrganization: OrganizationSummary
  needsActivation: boolean
  organizations: OrganizationSummary[]
}

export type OrganizationMemberView = {
  email: string
  id: string
  isCurrentUser: boolean
  joinedAt: string
  name: string
  role: OrganizationRole
}

export type PendingInvitationView = {
  email: string
  expiresAt: string
  id: string
  role: InvitableOrganizationRole
}

export type OrganizationManagementData = OrganizationContext & {
  canManage: boolean
  currentRole: OrganizationRole
  members: OrganizationMemberView[]
  pendingInvitations: PendingInvitationView[]
}

export type OrganizationActionResult = {
  fieldErrors?: Record<string, string>
  message?: string
  redirectTo?: string
  status:
    | "idle"
    | "success"
    | "validation"
    | "unauthorized"
    | "forbidden"
    | "conflict"
    | "not_found"
    | "provider"
    | "unexpected"
}

export const INITIAL_ORGANIZATION_ACTION_RESULT: OrganizationActionResult = {
  status: "idle",
}
