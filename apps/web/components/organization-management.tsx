"use client"

import { useActionState, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MailPlus, RotateCw, Trash2, UserMinus } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Textarea } from "@workspace/ui/components/textarea"

import {
  cancelOrganizationInvitationAction,
  inviteOrganizationMemberAction,
  removeOrganizationMemberAction,
  resendOrganizationInvitationAction,
  updateOrganizationAction,
  updateOrganizationMemberRoleAction,
} from "@/lib/features/organizations/actions"
import {
  INITIAL_ORGANIZATION_ACTION_RESULT,
  type OrganizationActionResult,
  type OrganizationManagementData,
} from "@/lib/features/organizations/types"
import {
  ORGANIZATION_DESCRIPTION_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
} from "@/lib/organization-validation"

function ActionMessage({ result }: { result: OrganizationActionResult }) {
  if (!result.message) return null

  return (
    <p
      className={
        result.status === "success"
          ? "text-sm text-foreground"
          : "text-sm text-destructive"
      }
      role={result.status === "success" ? "status" : "alert"}
    >
      {result.message}
    </p>
  )
}

export function OrganizationManagement({
  data,
}: {
  data: OrganizationManagementData
}) {
  const router = useRouter()
  const [rowResult, setRowResult] = useState<OrganizationActionResult>(
    INITIAL_ORGANIZATION_ACTION_RESULT
  )
  const [rowPending, startRowTransition] = useTransition()
  const [detailsState, detailsAction, detailsPending] = useActionState(
    updateOrganizationAction,
    INITIAL_ORGANIZATION_ACTION_RESULT
  )
  const [inviteState, inviteAction, invitePending] = useActionState(
    inviteOrganizationMemberAction,
    INITIAL_ORGANIZATION_ACTION_RESULT
  )

  function runRowAction(action: () => Promise<OrganizationActionResult>) {
    setRowResult(INITIAL_ORGANIZATION_ACTION_RESULT)
    startRowTransition(async () => {
      const result = await action()
      setRowResult(result)
      if (result.status === "success") router.refresh()
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Organization details</CardTitle>
          <CardDescription>
            {data.canManage
              ? "Keep the organization name and description current."
              : "Only owners and admins can change these details."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={detailsAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-organization-name">Name</Label>
              <Input
                id="settings-organization-name"
                name="name"
                defaultValue={data.activeOrganization.name}
                maxLength={ORGANIZATION_NAME_MAX_LENGTH}
                disabled={!data.canManage}
                required
              />
              {detailsState.fieldErrors?.name ? (
                <p className="text-sm text-destructive">
                  {detailsState.fieldErrors.name}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-organization-description">
                Description
              </Label>
              <Textarea
                id="settings-organization-description"
                name="description"
                defaultValue={data.activeOrganization.description ?? ""}
                maxLength={ORGANIZATION_DESCRIPTION_MAX_LENGTH}
                disabled={!data.canManage}
              />
              {detailsState.fieldErrors?.description ? (
                <p className="text-sm text-destructive">
                  {detailsState.fieldErrors.description}
                </p>
              ) : null}
            </div>
            <ActionMessage result={detailsState} />
            {data.canManage ? (
              <Button type="submit" disabled={detailsPending}>
                {detailsPending ? "Saving…" : "Save details"}
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite a member</CardTitle>
          <CardDescription>
            Invitations expire after 48 hours and must be accepted using the
            invited email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.canManage ? (
            <form action={inviteAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                {inviteState.fieldErrors?.email ? (
                  <p className="text-sm text-destructive">
                    {inviteState.fieldErrors.email}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select name="role" defaultValue="member">
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ActionMessage result={inviteState} />
              <Button type="submit" disabled={invitePending}>
                <MailPlus />
                {invitePending ? "Sending…" : "Send invitation"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ask an owner or admin to invite another member.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            {data.members.length} member{data.members.length === 1 ? "" : "s"}{" "}
            in this organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {data.members.map((member, index) => (
            <div key={member.id}>
              {index > 0 ? <Separator className="mb-4" /> : null}
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{member.name}</p>
                    {member.isCurrentUser ? (
                      <Badge variant="outline">You</Badge>
                    ) : null}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                {data.canManage &&
                member.role !== "owner" &&
                !member.isCurrentUser ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={member.role}
                      onValueChange={(role) =>
                        runRowAction(() =>
                          updateOrganizationMemberRoleAction(member.id, role)
                        )
                      }
                      disabled={rowPending}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      disabled={rowPending}
                      aria-label={`Remove ${member.name}`}
                      onClick={() =>
                        runRowAction(() =>
                          removeOrganizationMemberAction(member.id)
                        )
                      }
                    >
                      <UserMinus />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary" className="capitalize">
                    {member.role}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          <ActionMessage result={rowResult} />
        </CardContent>
      </Card>

      {data.canManage ? (
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>
              Invitation IDs are visible only to owners and admins.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.pendingInvitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending invitations.
              </p>
            ) : (
              data.pendingInvitations.map((pendingInvitation, index) => (
                <div key={pendingInvitation.id}>
                  {index > 0 ? <Separator className="mb-4" /> : null}
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {pendingInvitation.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pendingInvitation.role} · expires{" "}
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(pendingInvitation.expiresAt))}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={rowPending}
                        onClick={() =>
                          runRowAction(() =>
                            resendOrganizationInvitationAction(
                              pendingInvitation.id
                            )
                          )
                        }
                      >
                        <RotateCw />
                        Resend
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={rowPending}
                        aria-label={`Cancel invitation for ${pendingInvitation.email}`}
                        onClick={() =>
                          runRowAction(() =>
                            cancelOrganizationInvitationAction(
                              pendingInvitation.id
                            )
                          )
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
