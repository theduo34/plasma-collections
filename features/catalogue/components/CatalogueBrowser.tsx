'use client'

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePublicItems } from "@/features/catalogue/hooks/usePublicItems"
import { usePublicCategories } from "@/features/catalogue/hooks/usePublicCategories"
import { CatalogueSearchBar } from "@/features/catalogue/components/CatalogueSearchBar"
import { CatalogueCategoryRow } from "@/features/catalogue/components/CatalogueCategoryRow"
import { CatalogueItemCard } from "@/features/catalogue/components/CatalogueItemCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

export function CatalogueBrowser() {
  const items = usePublicItems()
  const categories = usePublicCategories()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")

  const categorySlug = searchParams.get("category")
  const selectedCategory = categories?.find((category) => category.slug === categorySlug) ?? null

  const query = search.trim().toLowerCase()

  const searchResults = useMemo(() => {
    if (!items || !query) return undefined
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, query])

  const categoryResults = useMemo(() => {
    if (!items || !selectedCategory) return undefined
    return items.filter((item) => item.categoryId === selectedCategory._id)
  }, [items, selectedCategory])

  if (items === undefined || categories === undefined) {
    return (
      <div className="container-page pt-6 pb-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <CatalogueSearchBar value={search} onChange={setSearch} />

      <div className="container-page flex flex-col gap-10 pt-6 pb-14">
        {query ? (
          searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((item) => (
                <CatalogueItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matches"
              description={`No items found for "${search.trim()}".`}
            />
          )
        ) : selectedCategory ? (
          categoryResults && categoryResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {categoryResults.map((item) => (
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
              <CatalogueCategoryRow key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items here yet"
            description="Check back soon, or browse another category."
          />
        )}
      </div>
    </div>
  )
}
