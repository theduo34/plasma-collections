import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { FeaturedItems } from "@/features/catalogue/components/FeaturedItems"

export function FeaturedSection() {
  return (
    <section>
      <div className="container-page section-y">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-medium tracking-widest text-foreground uppercase">
            New In
          </h2>
          <Link
            href="/catalogue"
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            View full catalogue
            <span className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground transition-colors group-hover:bg-muted">
              <ArrowRightIcon size={14} />
            </span>
          </Link>
        </div>
        <FeaturedItems />
      </div>
    </section>
  )
}
