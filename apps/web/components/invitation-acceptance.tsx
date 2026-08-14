"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { acceptOrganizationInvitationAction } from "@/lib/features/organizations/actions"
import type { OrganizationActionResult } from "@/lib/features/organizations/types"

export function InvitationAcceptance({
  invitationId,
}: {
  invitationId: string
}) {
  const router = useRouter()
  const started = useRef(false)
  const [pending, setPending] = useState(true)
  const [result, setResult] = useState<OrganizationActionResult | null>(null)

  const acceptInvitation = useCallback(async () => {
    setPending(true)
    const nextResult = await acceptOrganizationInvitationAction(invitationId)
    setResult(nextResult)
    setPending(false)

    if (nextResult.status === "success") {
      router.replace(nextResult.redirectTo ?? "/")
      router.refresh()
    }
  }, [invitationId, router])

  useEffect(() => {
    if (started.current) return
    started.current = true
    void acceptInvitation()
  }, [acceptInvitation])

  return (
    <div className="flex min-h-full items-center justify-center p-6 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {pending ? "Joining organization…" : "Invitation status"}
          </CardTitle>
          <CardDescription>
            The invitation is verified against your signed-in email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pending ? (
            <p className="text-sm text-muted-foreground">
              Accepting your invitation and activating the organization.
            </p>
          ) : result?.status === "success" ? (
            <p className="text-sm">Invitation accepted. Redirecting…</p>
          ) : (
            <p className="text-sm text-destructive" role="alert">
              {result?.message ?? "The invitation could not be accepted."}
            </p>
          )}
        </CardContent>
        {!pending && result?.status !== "success" ? (
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={() => void acceptInvitation()}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/onboarding/organization">
                Create an organization
              </Link>
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
