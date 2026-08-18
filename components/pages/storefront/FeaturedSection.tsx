import Link from "next/link"
import { FeaturedItems } from "@/features/catalogue/components/FeaturedItems"

export function FeaturedSection() {
  return (
    <section className="border-t border-border">
      <div className="container-page section-y">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-widest text-foreground uppercase">
            New In
          </h2>
          <Link href="/catalogue" className="text-sm text-muted-foreground hover:text-foreground">
            View full catalogue →
          </Link>
        </div>
        <FeaturedItems />
      </div>
    </section>
  )
}
