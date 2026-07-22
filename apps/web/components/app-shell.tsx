"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export function AppShell({
  children,
  sidebarOrganization,
  sidebarUser,
}: {
  children: React.ReactNode
  sidebarOrganization?: React.ReactNode
  /** Async server user menu — pass as AppSidebar child (not a named prop) for reliable streaming. */
  sidebarUser?: React.ReactNode
}) {
  return (
    <SidebarProvider className="flex h-svh w-full flex-col overflow-hidden">
      <SiteHeader />
      <div className="flex min-h-0 w-full flex-1">
        <AppSidebar organizationSwitcher={sidebarOrganization}>
          {sidebarUser}
        </AppSidebar>
        <SidebarInset className="min-h-0 overflow-auto overscroll-none">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
