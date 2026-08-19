import { cn } from "@/lib/utils"
import type { PublicItem } from "@/features/catalogue/types/item"
import { ItemCard } from "@/features/catalogue/components/ItemCard"

// 2 per row / 3 rows on mobile (first 6 items), 5 per row / 2 rows at lg
// (all 10) — items beyond the 6th stay hidden until the lg breakpoint.
export function ItemGrid({ items }: { items: PublicItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
      {items.map((item, index) => (
        <div
          key={item._id}
          className={cn(
            "animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards duration-500",
            index >= 6 && "hidden lg:block"
          )}
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  )
}
