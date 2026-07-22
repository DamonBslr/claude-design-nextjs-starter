import { OrganizationManagement } from "@/components/organization-management"
import { getOrganizationManagementData } from "@/lib/features/organizations/data"

export const dynamic = "force-dynamic"

export default async function OrganizationPage() {
  const data = await getOrganizationManagementData()

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground capitalize">
          {data.currentRole}
        </p>
        <h1 className="font-heading text-3xl tracking-tight">
          {data.activeOrganization.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage organization details, members, roles, and invitations.
        </p>
      </div>
      <OrganizationManagement data={data} />
    </div>
  )
}
