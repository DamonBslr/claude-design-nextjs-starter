import { buildSignInUrl } from "@sezaba/auth/urls"
import { LogIn } from "lucide-react"
import { headers } from "next/headers"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

import { getCachedSession } from "@/lib/session"
import { SidebarUserMenu } from "@/components/sidebar-user-menu"

async function getSignInCallbackUrl(): Promise<string> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}/`
}

/**
 * Server Component: resolves the session on the server and renders the final
 * UI directly into the streamed HTML. Wrap it in a `<Suspense>` boundary with
 * `<SidebarUserSkeleton />` as the fallback so the skeleton ships in the
 * initial HTML and the menu streams in without a hydration mismatch.
 */
export async function SidebarUser() {
  const session = await getCachedSession()

  if (!session?.user) {
    const signInUrl = buildSignInUrl(await getSignInCallbackUrl())

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild tooltip="Sign in">
            <a href={signInUrl}>
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground">
                <LogIn className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sign in</span>
                <span className="truncate text-xs text-muted-foreground">
                  to your account
                </span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return <SidebarUserMenu user={session.user} />
}
