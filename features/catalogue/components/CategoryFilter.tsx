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
    <div className="flex gap-2">
      {entries.map((entry) => (
        <button
          key={entry.id ?? "all"}
          type="button"
          aria-pressed={selected === entry.id}
          onClick={() => onSelect(entry.id)}
          className={cn(
            "rounded-md border px-3 py-1 text-xs uppercase tracking-wide transition-colors",
            selected === entry.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground hover:border-primary"
          )}
        >
          {entry.name}
        </button>
      ))}
    </div>
  )
}
