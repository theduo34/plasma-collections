'use client'
import type { Category } from "@/features/catalogue/types/item"

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
  return (
    <div className="flex gap-2">
      <button
        className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide"
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide"
          onClick={() => onSelect(category._id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
