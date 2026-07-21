import { Suspense } from "react"
import { Geist, Geist_Mono, Inter, Instrument_Serif } from "next/font/google"

import "@workspace/ui/globals.css"
import { AppShell } from "@/components/app-shell"
import { SidebarUser } from "@/components/sidebar-user"
import { SidebarUserSkeleton } from "@/components/sidebar-user-skeleton"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

const instrumentSerifHeading = Instrument_Serif({subsets:['latin'],weight:['400'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, instrumentSerifHeading.variable)}
    >
      <body className="overscroll-none overflow-hidden">
        <TooltipProvider>
          <ThemeProvider>
            <AppShell
              sidebarUser={
                <Suspense fallback={<SidebarUserSkeleton />}>
                  <SidebarUser />
                </Suspense>
              }
            >
              {children}
            </AppShell>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
