'use client'

import { useRef } from "react"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { CatalogueItemCard } from "@/features/catalogue/components/CatalogueItemCard"
import type { PublicCategory, PublicItem } from "@/features/catalogue/types/item"

// Airbnb-style browse row: title + "view all", a horizontally scrollable
// strip of cards, and left/right nav buttons that scroll it programmatically.
export function CatalogueCategoryRow({
  category,
  items,
}: {
  category: PublicCategory
  items: PublicItem[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/catalogue?category=${category.slug}`}
          className="group flex items-center gap-1.5 text-lg font-medium tracking-wide text-foreground uppercase"
        >
          {category.name}
          <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-320)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-muted"
          >
            <ArrowLeftIcon size={14} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(320)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-muted"
          >
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item._id} className="w-40 shrink-0 sm:w-52">
            <CatalogueItemCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
