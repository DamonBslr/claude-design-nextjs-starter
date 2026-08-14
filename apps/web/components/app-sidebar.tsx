"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  Circle,
  Command,
  LayoutDashboard,
  Settings2,
  Shapes,
  User,
} from "lucide-react"

import { APP_NAME } from "@/lib/app-config"
import { SidebarUserFooter } from "@/components/sidebar-user-footer"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

const navLinks = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Account", href: "/account", icon: User },
  { title: "Organization", href: "/organization", icon: Building2 },
  { title: "Charts", href: "/#charts", icon: BarChart3 },
  { title: "Forms", href: "/#forms", icon: Settings2 },
  { title: "Feedback", href: "/#feedback", icon: Shapes },
] as const

const installedPrimitives = [
  "Button",
  "Card",
  "Badge",
  "Select",
  "Slider",
  "Textarea",
  "Progress",
  "Chart",
  "Sidebar",
] as const

export function AppSidebar({
  children,
  organizationSwitcher,
}: {
  children?: React.ReactNode
  organizationSwitcher?: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={APP_NAME}>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{APP_NAME}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Monorepo template
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {organizationSwitcher}
        <form className="px-0 group-data-[collapsible=icon]:hidden">
          <SidebarInput placeholder="Search…" />
        </form>
      </SidebarHeader>
      <SidebarContent className="overscroll-none">
        <SidebarGroup>
          <SidebarGroupLabel>On this page</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Primitives installed</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {installedPrimitives.map((name) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton className="pointer-events-none text-muted-foreground">
                    <Circle className="size-2 fill-current" />
                    <span>{name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarUserFooter>{children}</SidebarUserFooter>
      <SidebarRail />
    </Sidebar>
  )
}
