import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { FeaturedItems } from "@/features/catalogue/components/FeaturedItems"

export function FeaturedSection() {
  return (
    <section>
      <div className="container-page section-y">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-widest text-foreground uppercase">
            New In
          </h2>
          <Link
            href="/catalogue"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View full catalogue
            <ArrowRightIcon size={14} />
          </Link>
        </div>
        <FeaturedItems />
      </div>
    </section>
  )
}
