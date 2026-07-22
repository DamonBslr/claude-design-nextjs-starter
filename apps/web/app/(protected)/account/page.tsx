import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

import type { AuthSession } from "@/lib/auth"
import { requireSession } from "@/lib/session"

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
  const session = await requireSession("/account")

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Account</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Protected route validated locally with{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            requireSession()
          </code>{" "}
          against this app&apos;s Better Auth database. The proxy performs only
          the fast cookie-presence redirect; this page performs the secure
          session lookup.
        </p>
      </div>

      <div className="grid max-w-3xl gap-6">
        <UserCard session={session} />
        <SessionCard session={session} />
      </div>
    </div>
  )
}

function UserCard({ session }: { session: AuthSession }) {
  const { user } = session

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>
          Profile from this app&apos;s auth database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-4">
          <DetailRow label="Name" value={user.name || "—"} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow
            label="Email verified"
            value={user.emailVerified ? "Yes" : "No"}
          />
          <DetailRow label="User ID" value={user.id} />
          <DetailRow label="Member since" value={formatDate(user.createdAt)} />
        </dl>
      </CardContent>
    </Card>
  )
}

function SessionCard({ session }: { session: AuthSession }) {
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
