import { ImageIcon } from "@phosphor-icons/react/dist/ssr"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/features/catalogue/types/item"

export function ItemCard({ item }: { item: Item }) {
  return (
    <div className="group flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary">
      <AspectRatio ratio={1} className="relative bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="text-muted-foreground/40" size={32} />
        </div>
        {!item.inStock && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Sold out
          </Badge>
        )}
      </AspectRatio>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-sm text-foreground">{item.name}</p>
        <p className="font-price text-sm text-primary">GH₵ {(item.price / 100).toFixed(2)}</p>
      </div>
    </div>
  )
}
