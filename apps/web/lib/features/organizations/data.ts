import "server-only"

import { cache } from "react"
import { and, asc, eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@workspace/db/client"
import { invitation, member } from "@workspace/db/schema"

import { auth } from "@/lib/auth"
import {
  canManageOrganization,
  isInvitableOrganizationRole,
  normalizeOrganizationRole,
} from "@/lib/organization-validation"
import { requireOrganization } from "@/lib/session"
import type { OrganizationManagementData } from "@/lib/features/organizations/types"

export const getOrganizationManagementData = cache(
  async (): Promise<OrganizationManagementData> => {
    const context = await requireOrganization("/organization")
    const organizationId = context.activeOrganization.id
    const [memberResult, currentMembership] = await Promise.all([
      auth.api.listMembers({
        headers: await headers(),
        query: {
          limit: 100,
          organizationId,
          sortBy: "createdAt",
          sortDirection: "asc",
        },
      }),
      db.query.member.findFirst({
        where: and(
          eq(member.organizationId, organizationId),
          eq(member.userId, context.session.user.id)
        ),
      }),
    ])

    const currentRole = normalizeOrganizationRole(
      currentMembership?.role ?? "member"
    )
    const canManage = canManageOrganization(currentRole)
    const pendingInvitations = canManage
      ? await db
          .select({
            email: invitation.email,
            expiresAt: invitation.expiresAt,
            id: invitation.id,
            role: invitation.role,
          })
          .from(invitation)
          .where(
            and(
              eq(invitation.organizationId, organizationId),
              eq(invitation.status, "pending")
            )
          )
          .orderBy(asc(invitation.email))
      : []

    return {
      activeOrganization: context.activeOrganization,
      canManage,
      currentRole,
      members: memberResult.members.map((organizationMember) => ({
        email: organizationMember.user.email,
        id: organizationMember.id,
        isCurrentUser: organizationMember.userId === context.session.user.id,
        joinedAt: organizationMember.createdAt.toISOString(),
        name: organizationMember.user.name,
        role: normalizeOrganizationRole(organizationMember.role),
      })),
      needsActivation: context.needsActivation,
      organizations: context.organizations,
      pendingInvitations: pendingInvitations.flatMap((pendingInvitation) =>
        isInvitableOrganizationRole(pendingInvitation.role)
          ? [
              {
                email: pendingInvitation.email,
                expiresAt: pendingInvitation.expiresAt.toISOString(),
                id: pendingInvitation.id,
                role: pendingInvitation.role,
              },
            ]
          : []
      ),
    }
  }
)
