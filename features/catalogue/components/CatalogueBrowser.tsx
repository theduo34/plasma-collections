'use client'

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePublicItems } from "@/features/catalogue/hooks/usePublicItems"
import { usePublicCategories } from "@/features/catalogue/hooks/usePublicCategories"
import { CategoryFilter } from "@/features/catalogue/components/CategoryFilter"
import { ItemGrid } from "@/features/catalogue/components/ItemGrid"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

export function CatalogueBrowser() {
  const items = usePublicItems()
  const categories = usePublicCategories()
  const router = useRouter()
  const searchParams = useSearchParams()

  const categorySlug = searchParams.get("category")
  const selectedCategoryId =
    categories?.find((category) => category.slug === categorySlug)?._id ?? null

  function handleSelect(categoryId: string | null) {
    const slug = categories?.find((category) => category._id === categoryId)?.slug
    const params = new URLSearchParams(searchParams)
    if (slug) params.set("category", slug)
    else params.delete("category")
    router.replace(`/catalogue${params.size > 0 ? `?${params}` : ""}`, { scroll: false })
  }

  const filteredItems = useMemo(() => {
    if (!items) return undefined
    if (!selectedCategoryId) return items
    return items.filter((item) => item.categoryId === selectedCategoryId)
  }, [items, selectedCategoryId])

  if (items === undefined || categories === undefined) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategoryId}
          onSelect={handleSelect}
        />
      )}
      {filteredItems && filteredItems.length > 0 ? (
        <ItemGrid items={filteredItems} />
      ) : (
        <EmptyState
          title="No items here yet"
          description="Check back soon, or browse another category."
        />
      )}
    </div>
  )
}
