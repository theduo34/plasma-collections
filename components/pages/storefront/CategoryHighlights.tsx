import Link from "next/link"
import type { Icon } from "@phosphor-icons/react"
import { ScissorsIcon, SneakerIcon, TagIcon, TShirtIcon } from "@phosphor-icons/react/dist/ssr"
import type { Category } from "@/features/catalogue/types/item"

// Falls back to a generic tag icon for any category slug added later that
// isn't one of the three the storefront launched with.
const CATEGORY_ICONS: Record<string, Icon> = {
  clothes: TShirtIcon,
  shoes: SneakerIcon,
  repairs: ScissorsIcon,
}

export function CategoryHighlights({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section className="border-t border-border">
      <div className="container-page section-y">
        <h2 className="mb-6 text-sm font-medium tracking-widest text-foreground uppercase">
          Shop by Category
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((category) => {
            const CategoryIcon = CATEGORY_ICONS[category.slug] ?? TagIcon
            return (
              <Link
                key={category._id}
                href={`/catalogue?category=${category.slug}`}
                className="flex flex-col items-center gap-3 border border-border px-6 py-8 text-center transition-colors hover:border-primary"
              >
                <CategoryIcon className="text-primary" size={32} />
                <span className="text-sm font-medium tracking-widest text-foreground uppercase">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
