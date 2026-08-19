'use client'

import { cn } from "@/lib/utils"
import type { Category } from "@/features/catalogue/types/item"

type FilterEntry = { id: string | null; name: string }

// Filter tabs: All / Clothes / Shoes / Repairs.
export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[]
  selected: string | null
  onSelect: (categoryId: string | null) => void
}) {
  const entries: FilterEntry[] = [
    { id: null, name: "All" },
    ...categories.map((category) => ({ id: category._id, name: category.name })),
  ]

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border p-1">
      {entries.map((entry) => (
        <button
          key={entry.id ?? "all"}
          type="button"
          aria-pressed={selected === entry.id}
          onClick={() => onSelect(entry.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm uppercase tracking-wide transition-colors",
            selected === entry.id
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          )}
        >
          {entry.name}
        </button>
      ))}
    </div>
  )
}
