'use client'

import { useEffect, useState } from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const COLLAPSE_THRESHOLD = 80

// Airbnb-style docked search bar: sits below the nav, then smoothly folds
// (shrinks + gains a border/shadow) as you scroll down, sticking flush
// against the nav — and un-folds again as you scroll back toward the top.
export function CatalogueSearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    function onScroll() {
      setCollapsed(window.scrollY > COLLAPSE_THRESHOLD)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "sticky top-16 z-10 border-b border-transparent bg-background/95 backdrop-blur transition-all duration-300",
        collapsed ? "border-border py-2 shadow-sm" : "py-5"
      )}
    >
      <div className="container-page">
        <label
          className={cn(
            "mx-auto flex max-w-xl items-center gap-3 rounded-full border border-border bg-background px-5 transition-all duration-300 hover:border-muted-foreground focus-within:border-primary",
            collapsed ? "h-10" : "h-12"
          )}
        >
          <MagnifyingGlassIcon size={18} className="shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search items…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>
    </div>
  )
}
