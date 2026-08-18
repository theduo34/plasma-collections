import Link from "next/link"
import Image from "next/image"
import type { PublicCategory } from "@/features/catalogue/types/item"

// Edge-to-edge photo-block treatment — no gaps, no borders, category name
// overlaid directly on the image. Without a real photo yet, bg-foreground /
// text-background stand in for one: swapping the theme's two neutrals gives
// a dark placeholder block without inventing a new color.
export function CategoryHighlights({ categories }: { categories: PublicCategory[] }) {
  if (categories.length === 0) return null

  return (
    <section className="flex min-h-[28rem]">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/catalogue?category=${category.slug}`}
          className="group relative flex flex-1 items-end overflow-hidden bg-foreground p-8"
        >
          {category.imageUrl && (
            <>
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="33vw"
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
