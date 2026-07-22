"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Building2, Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { setActiveOrganizationAction } from "@/lib/features/organizations/actions"
import type { OrganizationSummary } from "@/lib/features/organizations/types"

export function OrganizationSwitcher({
  activeOrganizationId,
  needsActivation,
  organizations,
}: {
  activeOrganizationId: string
  needsActivation: boolean
  organizations: OrganizationSummary[]
}) {
  const router = useRouter()
  const activationStarted = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const selectOrganization = useCallback(
    (organizationId: string) => {
      setError(null)
      startTransition(async () => {
        const result = await setActiveOrganizationAction(organizationId)
        if (result.status !== "success") {
          setError(result.message ?? "Could not switch organization.")
          return
        }
        router.refresh()
      })
    },
    [router]
  )

  useEffect(() => {
    if (!needsActivation || activationStarted.current) return
    activationStarted.current = true
    selectOrganization(activeOrganizationId)
  }, [activeOrganizationId, needsActivation, selectOrganization])

  return (
    <div className="flex flex-col gap-2 px-2 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center gap-2">
        <Building2 className="size-4 text-muted-foreground" />
        <Select
          value={activeOrganizationId}
          onValueChange={selectOrganization}
          disabled={pending}
        >
          <SelectTrigger className="min-w-0 flex-1">
            <SelectValue placeholder="Organization" />
          </SelectTrigger>
          <SelectContent align="start">
            {organizations.map((organization) => (
              <SelectItem key={organization.id} value={organization.id}>
                {organization.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="icon-sm" variant="ghost" asChild>
          <Link
            href="/onboarding/organization?new=1&callbackURL=/organization"
            aria-label="Create organization"
          >
            <Plus />
          </Link>
        </Button>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
