'use client'

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CategoryFilter } from "@/features/catalogue/components/CategoryFilter"
import type { Category } from "@/features/catalogue/types/item"

const COLLAPSE_THRESHOLD = 80

// Airbnb-style docked search bar: sits below the nav, then smoothly folds
// (shrinks + gains a border/shadow) as you scroll down, sticking flush
// against the nav — and un-folds again as you scroll back toward the top.
export function CatalogueSearchBar({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[]
  selected: string | null
  onSelect: (categoryId: string | null) => void
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
        <CategoryFilter categories={categories} selected={selected} onSelect={onSelect} />
      </div>
    </div>
  )
}
