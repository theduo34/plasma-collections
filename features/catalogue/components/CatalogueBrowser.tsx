'use client'

import { useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePublicItems } from "@/features/catalogue/hooks/usePublicItems"
import { usePublicCategories } from "@/features/catalogue/hooks/usePublicCategories"
import { CategoryFilter } from "@/features/catalogue/components/CategoryFilter"
import { CatalogueCategoryRow } from "@/features/catalogue/components/CatalogueCategoryRow"
import { CatalogueItemCard } from "@/features/catalogue/components/CatalogueItemCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

export function CatalogueBrowser() {
  const items = usePublicItems()
  const categories = usePublicCategories()
  const router = useRouter()
  const searchParams = useSearchParams()

  const categorySlug = searchParams.get("category")
  const selectedCategory = categories?.find((category) => category.slug === categorySlug) ?? null

  function handleSelect(categoryId: string | null) {
    const slug = categories?.find((category) => category._id === categoryId)?.slug
    const params = new URLSearchParams(searchParams)
    if (slug) params.set("category", slug)
    else params.delete("category")
    router.replace(`/catalogue${params.size > 0 ? `?${params}` : ""}`, { scroll: false })
  }

  const filteredItems = useMemo(() => {
    if (!items || !selectedCategory) return undefined
    return items.filter((item) => item.categoryId === selectedCategory._id)
  }, [items, selectedCategory])

  if (items === undefined || categories === undefined) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory?._id ?? null}
          onSelect={handleSelect}
        />
      )}

      {selectedCategory ? (
        filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <CatalogueItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items here yet"
            description="Check back soon, or browse another category."
          />
        )
      ) : items.length > 0 ? (
        <div className="flex flex-col gap-12">
          {categories.map((category) => (
            <CatalogueCategoryRow
              key={category._id}
              category={category}
              items={items.filter((item) => item.categoryId === category._id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items here yet"
          description="Check back soon, or browse another category."
        />
      )}
    </div>
  )
}
