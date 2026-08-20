'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { PublicCategory } from "@/features/catalogue/types/item"

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Edge-to-edge photo-block treatment — no gaps, no borders, category name
// overlaid directly on the image. Without a real photo yet, bg-foreground /
// text-background stand in for one: swapping the theme's two neutrals gives
// a dark placeholder block without inventing a new color.
//
// Which categories show (and their order) is randomized once per page load
// — 3 on mobile, up to 4 at lg — so different visitors, and every refresh,
// see a different mix. The shuffle only happens client-side, after mount:
// doing it in a useState initializer would run once during SSR and again
// during client hydration, and since Math.random() differs each time, the
// two renders would produce a different order and React would throw a
// hydration mismatch. Starting from the unshuffled list keeps the first
// paint identical on server and client, then the effect reorders it.
export function CategoryHighlights({ categories }: { categories: PublicCategory[] }) {
  const [shown, setShown] = useState(() => categories.slice(0, 4))

  useEffect(() => {
    queueMicrotask(() => setShown(shuffle(categories).slice(0, 4)))
  }, [categories])

  if (shown.length === 0) return null

  return (
    <section className="flex min-h-[28rem]">
      {shown.map((category, index) => (
        <Link
          key={category._id}
          href={`/catalogue?category=${category.slug}`}
          className={cn(
            "group relative flex flex-1 items-end overflow-hidden bg-foreground p-8",
            index === 3 && "hidden lg:flex"
          )}
        >
          {category.imageUrl && (
            <>
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="25vw"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
              {/* Scrim for label legibility over a real photo. */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
            </>
          )}
          <div className="relative">
            <span className="font-sans text-2xl font-semibold tracking-wide text-background uppercase">
              {category.name}
            </span>
            <div className="mt-2 h-0.5 w-9 bg-primary" />
          </div>
        </Link>
      ))}
    </section>
  )
}
