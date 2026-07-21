import { LogIn } from "lucide-react"
import Link from "next/link"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

import { getCachedSession } from "@/lib/session"
import { SidebarUserMenu } from "@/components/sidebar-user-menu"

/**
 * Server Component: resolves the session on the server and renders the final
 * UI directly into the streamed HTML. Wrap it in a `<Suspense>` boundary with
 * `<SidebarUserSkeleton />` as the fallback so the skeleton ships in the
 * initial HTML and the menu streams in without a hydration mismatch.
 */
export async function SidebarUser() {
  const session = await getCachedSession()

  if (!session?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild tooltip="Sign in">
            <Link href="/sign-in?callbackURL=/">
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground">
                <LogIn className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sign in</span>
                <span className="truncate text-xs text-muted-foreground">
                  to your account
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return <SidebarUserMenu user={session.user} />
}
