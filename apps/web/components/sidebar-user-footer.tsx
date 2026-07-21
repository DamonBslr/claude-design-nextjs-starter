"use client"

import { useEffect, useRef, useState } from "react"

import { SidebarFooter } from "@workspace/ui/components/sidebar"

import { SidebarUserSkeleton } from "@/components/sidebar-user-skeleton"

const MIN_OVERLAY_MS = 350

function footerHasResolvedUserUi(root: HTMLElement) {
  const button = root.querySelector(
    '[data-sidebar="menu-button"][data-size="lg"]'
  )
  if (!button) return false
  return (button.textContent?.trim().length ?? 0) > 3
}

/**
 * Keeps a visible skeleton overlay until the streamed server user menu (or
 * sign-in link) has committed into the DOM, for at least MIN_OVERLAY_MS.
 */
export function SidebarUserFooter({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedAt = useRef(0)
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    mountedAt.current = Date.now()

    let minDurationTimer: ReturnType<typeof setTimeout> | undefined

    const sync = () => {
      const ready = footerHasResolvedUserUi(root)
      const elapsed = Date.now() - mountedAt.current
      const keepOverlay = !ready || elapsed < MIN_OVERLAY_MS
      setShowOverlay(keepOverlay)

      if (ready && elapsed < MIN_OVERLAY_MS) {
        if (minDurationTimer) clearTimeout(minDurationTimer)
        minDurationTimer = setTimeout(
          () => sync(),
          MIN_OVERLAY_MS - elapsed
        )
      }
    }

    sync()
    const observer = new MutationObserver(() => sync())
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => {
      observer.disconnect()
      if (minDurationTimer) clearTimeout(minDurationTimer)
    }
  }, [])

  return (
    <SidebarFooter>
      <div ref={containerRef} className="relative min-h-12 w-full">
        {showOverlay ? (
          <div
            className="absolute inset-0 z-10 bg-sidebar"
            aria-busy="true"
          >
            <SidebarUserSkeleton />
          </div>
        ) : null}
        {children}
      </div>
    </SidebarFooter>
  )
}
