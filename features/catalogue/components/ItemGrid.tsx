import type { PublicItem } from "@/features/catalogue/types/item"
import { ItemCard } from "@/features/catalogue/components/ItemCard"

export function ItemGrid({ items }: { items: PublicItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item._id}
          className="animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards duration-500"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  )
}
