"use client"

import { useActionState, useEffect } from "react"
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
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

import { createOrganizationAction } from "@/lib/features/organizations/actions"
import { INITIAL_ORGANIZATION_ACTION_RESULT } from "@/lib/features/organizations/types"
import {
  ORGANIZATION_DESCRIPTION_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
} from "@/lib/organization-validation"

export function OrganizationSetupForm({
  callbackURL,
  defaultName,
}: {
  callbackURL: string
  defaultName: string
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    createOrganizationAction,
    INITIAL_ORGANIZATION_ACTION_RESULT
  )

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.replace(state.redirectTo)
      router.refresh()
    }
  }, [router, state])

  return (
    <div className="flex min-h-full items-center justify-center p-6 md:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your organization</CardTitle>
          <CardDescription>
            Every account belongs to an organization. You will be its owner and
            can invite your team next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <input type="hidden" name="callbackURL" value={callbackURL} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="organization-name">Organization name</Label>
              <Input
                id="organization-name"
                name="name"
                defaultValue={defaultName.slice(
                  0,
                  ORGANIZATION_NAME_MAX_LENGTH
                )}
                maxLength={ORGANIZATION_NAME_MAX_LENGTH}
                autoComplete="organization"
                aria-invalid={Boolean(state.fieldErrors?.name)}
                required
              />
              {state.fieldErrors?.name ? (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.name}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="organization-description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="organization-description"
                name="description"
                maxLength={ORGANIZATION_DESCRIPTION_MAX_LENGTH}
                aria-invalid={Boolean(state.fieldErrors?.description)}
                placeholder="What does your organization do?"
              />
              {state.fieldErrors?.description ? (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.description}
                </p>
              ) : null}
            </div>
            {state.message ? (
              <p className="text-sm text-destructive" role="alert">
                {state.message}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? "Creating organization…" : "Create organization"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Invited instead? Open the invitation link sent to your email.
        </CardFooter>
      </Card>
    </div>
  )
}
