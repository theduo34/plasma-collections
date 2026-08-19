'use client'

import { useRef } from "react"
import Link from "next/link"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { CatalogueItemCard } from "@/features/catalogue/components/CatalogueItemCard"
import type { PublicCategory, PublicItem } from "@/features/catalogue/types/item"

// Airbnb-style browse row: title + "view all", a horizontally scrollable
// strip of cards (2 visible on mobile, 5 on large screens), and left/right
// nav buttons that page through it by one screen's worth at a time.
export function CatalogueCategoryRow({
  category,
  items,
}: {
  category: PublicCategory
  items: PublicItem[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollByPage(direction: 1 | -1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" })
  }

  if (items.length === 0) return null

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
        {items.map((item) => (
          <div
            key={item._id}
            className="w-[calc((100%-1rem)/2)] shrink-0 sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
          >
            <CatalogueItemCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
