import { Badge } from "@/components/ui/badge"
import type { PublicItem } from "@/features/catalogue/types/item"

// Shared across ItemCard, CatalogueItemCard, and ItemDetailPage so "sold
// out" and "new" read the same way everywhere in the storefront.
export function ItemStatusBadges({ item }: { item: PublicItem }) {
  return (
    <>
      {!item.inStock && (
        <Badge
          variant="outline"
          className="absolute top-2 left-2 rounded-full border-border bg-background/90 backdrop-blur-sm"
        >
          Sold out
        </Badge>
      )}
      {item.isNew && item.inStock && (
        <Badge
          variant="outline"
          className="absolute top-2 right-2 rounded-full border-transparent bg-foreground text-background"
        >
          New
        </Badge>
      )}
    </>
  )
}
