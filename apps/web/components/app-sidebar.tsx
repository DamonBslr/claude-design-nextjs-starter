"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Circle,
  LayoutDashboard,
  Palette,
  Settings2,
  Shapes,
  Type,
  User,
} from "lucide-react"

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
  SidebarSeparator,
} from "@workspace/ui/components/sidebar"

const themeOptions = [
  { label: "Style", value: "Nova" },
  { label: "Base color", value: "Neutral" },
  { label: "Theme", value: "Neutral" },
  { label: "Chart color", value: "Red" },
  { label: "Heading font", value: "Instrument Serif" },
  { label: "Body font", value: "Inter" },
  { label: "Icon library", value: "Lucide" },
] as const

const componentLinks = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Account", href: "/account", icon: User },
  { title: "Charts", href: "/#charts", icon: BarChart3 },
  { title: "Forms", href: "/#forms", icon: Settings2 },
  { title: "Feedback", href: "/#feedback", icon: Shapes },
] as const

export function AppSidebar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset" className="pt-14">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Component showcase">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Palette className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">shadcn/ui</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Monorepo template
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <form className="px-0 group-data-[collapsible=icon]:hidden">
          <SidebarInput placeholder="Search components..." />
        </form>
      </SidebarHeader>
      <SidebarContent className="overscroll-none">
        <SidebarGroup>
          <SidebarGroupLabel>Theme (Nova preset)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {themeOptions.map((option) => (
                <SidebarMenuItem key={option.label}>
                  <SidebarMenuButton className="pointer-events-none">
                    <Type className="opacity-60" />
                    <span className="flex-1">{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.value}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>On this page</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {componentLinks.map((item) => (
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
              {[
                "Button",
                "Card",
                "Badge",
                "Select",
                "Slider",
                "Textarea",
                "Progress",
                "Chart",
                "Sidebar",
              ].map((name) => (
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
