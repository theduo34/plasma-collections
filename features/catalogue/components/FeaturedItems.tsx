'use client'

import { cn } from "@/lib/utils"
import { usePublicItems } from "@/features/catalogue/hooks/usePublicItems"
import { ItemGrid } from "@/features/catalogue/components/ItemGrid"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

const FEATURED_COUNT = 10

export function FeaturedItems() {
  const items = usePublicItems()

  if (items === undefined) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
        {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("aspect-square rounded-md", index >= 6 && "hidden lg:block")}
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="New arrivals coming soon"
        description="We're adding pieces to the catalogue — check back shortly, or message us on WhatsApp for what's in store."
      />
    )
  }

  return <ItemGrid items={items.slice(0, FEATURED_COUNT)} />
}
