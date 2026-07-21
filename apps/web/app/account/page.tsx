import { getSession } from "@sezaba/auth/server"
import type { Session } from "@sezaba/auth/types"
import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export const dynamic = "force-dynamic"

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-start">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm break-all">{value}</dd>
    </div>
  )
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Account</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Could not load your session from the auth server. If you just signed
            in, try refreshing. Otherwise sign in again.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Back to overview</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Account</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Protected route validated with{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            getSession()
          </code>{" "}
          from <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@sezaba/auth/server</code>.
          The proxy already gates access via the shared{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.sezaba.de</code>{" "}
          session cookie.
        </p>
      </div>

      <div className="grid max-w-3xl gap-6">
        <UserCard session={session} />
        <SessionCard session={session} />
      </div>
    </div>
  )
}

function UserCard({ session }: { session: Session }) {
  const { user } = session

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>Profile from the central auth server</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-4">
          <DetailRow label="Name" value={user.name || "—"} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow
            label="Email verified"
            value={user.emailVerified ? "Yes" : "No"}
          />
          <DetailRow
            label="Role"
            value={
              <span className="flex flex-wrap gap-1.5 font-sans">
                {user.role ? (
                  <Badge variant="secondary">{user.role}</Badge>
                ) : (
                  "—"
                )}
                {user.customRoles?.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </span>
            }
          />
          <DetailRow label="User ID" value={user.id} />
          <DetailRow
            label="Member since"
            value={formatDate(user.createdAt)}
          />
        </dl>
      </CardContent>
    </Card>
  )
}

function SessionCard({ session }: { session: Session }) {
  const { session: authSession } = session

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session</CardTitle>
        <CardDescription>Current Better Auth session metadata</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-4">
          <DetailRow label="Session ID" value={authSession.id} />
          <DetailRow
            label="Expires"
            value={formatDate(authSession.expiresAt)}
          />
          <DetailRow
            label="Created"
            value={formatDate(authSession.createdAt)}
          />
          {authSession.ipAddress ? (
            <DetailRow label="IP address" value={authSession.ipAddress} />
          ) : null}
          {authSession.userAgent ? (
            <DetailRow label="User agent" value={authSession.userAgent} />
          ) : null}
        </dl>
        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground">
          Session token is omitted from this demo page.
        </p>
      </CardContent>
    </Card>
  )
}
