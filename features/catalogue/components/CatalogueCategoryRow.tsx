'use client'

import { useRef } from "react"
import Link from "next/link"
import { usePaginatedQuery } from "convex/react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { api } from "@/convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { CatalogueItemCard } from "@/features/catalogue/components/CatalogueItemCard"
import type { PublicCategory } from "@/features/catalogue/types/item"

const INITIAL_BATCH = 6
const LOAD_MORE_BATCH = 6

const CARD_WIDTH = "w-[calc((100%-1rem)/2)] shrink-0 sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"

// Airbnb-style browse row: title + "view all", a horizontally scrollable
// strip of cards (2 visible on mobile, 5 on large screens), and left/right
// nav buttons that page through it. Only an initial batch loads with the
// row — paging past what's loaded with the next arrow fetches more.
export function CatalogueCategoryRow({ category }: { category: PublicCategory }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { results, status, loadMore } = usePaginatedQuery(
    api.public.items.listByCategoryPage,
    { categoryId: category._id },
    { initialNumItems: INITIAL_BATCH }
  )

  function scrollByPage(direction: 1 | -1) {
    const el = scrollRef.current
    if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" })
    if (direction === 1 && status === "CanLoadMore") loadMore(LOAD_MORE_BATCH)
  }

  if (status !== "LoadingFirstPage" && results.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/catalogue?category=${category.slug}`}
            className="group flex items-center gap-1.5 text-lg font-medium tracking-wide text-foreground uppercase"
          >
            {category.name}
            <CaretRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          {category.description && (
            <p className="text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByPage(-1)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-muted"
          >
            <CaretLeftIcon size={14} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByPage(1)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-muted"
          >
            <CaretRightIcon size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {status === "LoadingFirstPage"
          ? Array.from({ length: INITIAL_BATCH }).map((_, index) => (
              <div key={index} className={CARD_WIDTH}>
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            ))
          : results.map((item) => (
              <div key={item._id} className={CARD_WIDTH}>
                <CatalogueItemCard item={item} />
              </div>
            ))}
      </div>
    </section>
  )
}
