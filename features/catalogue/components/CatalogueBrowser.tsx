'use client'

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MagnifyingGlassIcon, PackageIcon } from "@phosphor-icons/react"
import { usePublicItems } from "@/features/catalogue/hooks/usePublicItems"
import { usePublicCategories } from "@/features/catalogue/hooks/usePublicCategories"
import { CatalogueSearchBar } from "@/features/catalogue/components/CatalogueSearchBar"
import { CatalogueCategoryRow } from "@/features/catalogue/components/CatalogueCategoryRow"
import { CatalogueItemCard } from "@/features/catalogue/components/CatalogueItemCard"
import { CatalogueEmptyState } from "@/features/catalogue/components/CatalogueEmptyState"
import { Skeleton } from "@/components/ui/skeleton"

export function CatalogueBrowser() {
  const items = usePublicItems()
  const categories = usePublicCategories()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")

  const categorySlug = searchParams.get("category")
  const selectedCategory = categories?.find((category) => category.slug === categorySlug) ?? null

  const query = search.trim().toLowerCase()

  function clearCategory() {
    router.replace("/catalogue", { scroll: false })
  }

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
      <CatalogueSearchBar
        value={search}
        onChange={setSearch}
        activeCategoryName={!query ? selectedCategory?.name : null}
        onClearCategory={clearCategory}
      />

      <div className="container-page flex flex-col gap-10 pt-6 pb-14">
        {query ? (
          searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((item) => (
                <CatalogueItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <CatalogueEmptyState
              icon={<MagnifyingGlassIcon size={26} className="text-muted-foreground" />}
              title="No results found"
              description={`We couldn't find anything for "${search.trim()}". Try a different word, or browse the full catalogue.`}
              action={
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted"
                >
                  Clear search
                </button>
              }
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
            <CatalogueEmptyState
              icon={<PackageIcon size={26} className="text-muted-foreground" />}
              title="No items here yet"
              description="Check back soon, or browse another category."
              action={
                <button
                  type="button"
                  onClick={clearCategory}
                  className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-muted"
                >
                  Browse all categories
                </button>
              }
            />
          )
        ) : items.length > 0 ? (
          <div className="flex flex-col gap-12">
            {categories.map((category) => (
              <CatalogueCategoryRow key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <CatalogueEmptyState
            icon={<PackageIcon size={26} className="text-muted-foreground" />}
            title="No items here yet"
            description="Check back soon, or message us on WhatsApp for what's in store."
          />
        )}
      </div>
    </div>
  )
}
