"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { label: "Overview", href: "/", external: false },
  { label: "Account", href: "/account", external: false },
  {
    label: "Sezaba",
    href: "https://sezaba.de",
    external: true,
  },
] as const

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 flex w-full shrink-0 items-center gap-2 bg-sidebar px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
      <SidebarTrigger className="border bg-background shadow-sm" />
      <nav className="hidden items-center gap-5 text-sm md:flex">
        {navItems.map((item) => {
          const isActive =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname === item.href)

          const className = cn(
            "inline-flex items-center gap-1 transition-colors hover:text-foreground",
            isActive
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          )

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {item.label}
                <ExternalLink className="size-3.5 opacity-60" aria-hidden />
              </a>
            )
          }

          return (
            <Link key={item.label} href={item.href} className={className}>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
      </div>
    </header>
  )
}
