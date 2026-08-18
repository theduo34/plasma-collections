import Link from "next/link"
import type { Category } from "@/features/catalogue/types/item"

// Edge-to-edge photo-block treatment — no gaps, no borders, category name
// overlaid directly on the (placeholder, for now) image. bg-foreground /
// text-background stand in for a real product photo: swapping the theme's
// two neutrals gives a dark placeholder block without inventing a new color.
export function CategoryHighlights({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section className="flex min-h-[28rem]">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/catalogue?category=${category.slug}`}
          className="group relative flex flex-1 items-end bg-foreground p-8 transition-opacity hover:opacity-90"
        >
          <div>
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
