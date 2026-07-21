"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function SidebarUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-12 w-full items-center gap-2 rounded-md p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Skeleton className="size-8 shrink-0 rounded-lg bg-sidebar-foreground/15" />
          <div className="flex flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
            <Skeleton className="h-3.5 w-24 bg-sidebar-foreground/15" />
            <Skeleton className="h-3 w-32 bg-sidebar-foreground/10" />
          </div>
          <Skeleton className="ml-auto size-4 shrink-0 bg-sidebar-foreground/15 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
