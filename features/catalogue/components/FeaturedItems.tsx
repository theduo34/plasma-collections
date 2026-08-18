'use client'

import { usePublicItems } from "@/features/catalogue/hooks/usePublicItems"
import { ItemGrid } from "@/features/catalogue/components/ItemGrid"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

const FEATURED_COUNT = 8

export function FeaturedItems() {
  const items = usePublicItems()

  if (items === undefined) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
          <Skeleton key={index} className="aspect-square" />
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
