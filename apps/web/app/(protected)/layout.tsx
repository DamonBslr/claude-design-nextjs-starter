import { AppShell } from "@/components/app-shell"
import { OrganizationSwitcher } from "@/components/organization-switcher"
import { SidebarUser } from "@/components/sidebar-user"
import { requireOrganization } from "@/lib/session"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationContext = await requireOrganization()

  return (
    <AppShell
      sidebarOrganization={
        <OrganizationSwitcher
          activeOrganizationId={organizationContext.activeOrganization.id}
          needsActivation={organizationContext.needsActivation}
          organizations={organizationContext.organizations}
        />
      }
      sidebarUser={<SidebarUser />}
    >
      {children}
    </AppShell>
  )
}
