import type { Item } from "@/features/catalogue/types/item"

export function ItemCard({ item }: { item: Item }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="text-sm text-foreground">{item.name}</p>
      <p className="font-price text-sm text-primary">GH₵ {(item.price / 100).toFixed(2)}</p>
    </div>
  )
}
