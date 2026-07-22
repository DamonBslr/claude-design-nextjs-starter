import { ShowcaseDashboard } from "@/components/component-showcase"
import { requireSession } from "@/lib/session"

export default async function Page() {
  await requireSession()

  return <ShowcaseDashboard />
}
