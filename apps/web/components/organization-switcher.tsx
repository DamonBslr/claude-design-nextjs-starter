"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Building2, ChevronDown, Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

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
  const activeOrganization = organizations.find(
    (organization) => organization.id === activeOrganizationId
  )

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="min-w-0 flex-1 justify-between border-input bg-transparent px-2.5 font-normal dark:bg-input/30 dark:hover:bg-input/50"
              disabled={pending}
            >
              <span className="truncate">
                {activeOrganization?.name ?? "Organization"}
              </span>
              <ChevronDown className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={activeOrganizationId}
              onValueChange={selectOrganization}
            >
              {organizations.map((organization) => (
                <DropdownMenuRadioItem
                  key={organization.id}
                  value={organization.id}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {organization.name}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/onboarding/organization?new=1&callbackURL=/organization">
                <Plus />
                Create new
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
