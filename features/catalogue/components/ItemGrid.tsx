import type { PublicItem } from "@/features/catalogue/types/item"
import { ItemCard } from "@/features/catalogue/components/ItemCard"

export function ItemGrid({ items }: { items: PublicItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  )
}
