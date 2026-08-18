import { CtaButton } from "@/components/pages/storefront/CtaButton"

// Full-bleed campaign block — -mt-16 pulls it up under StorefrontNav's
// reserved sticky height so the nav overlays it transparently on load.
export function HeroSection() {
  return (
    <section className="dark hero-texture -mt-16 flex min-h-[46rem] items-center justify-center overflow-hidden bg-background text-center">
      <div className="flex flex-col items-center gap-6 px-6">
        <span className="text-sm uppercase tracking-[0.35em] text-primary">
          Ghanaian Fashion House
        </span>
        <h1 className="font-sans text-6xl leading-none font-bold tracking-wide text-foreground uppercase sm:text-8xl">
          Plasma
          <br />
          Collections
        </h1>
        <CtaButton href="/catalogue" className="mt-2">
          Browse Catalogue
        </CtaButton>
      </div>
    </section>
  )
}
