import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { CtaButton } from "@/components/pages/storefront/CtaButton"

export function HeroSection({ chatHref }: { chatHref?: string }) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-20 text-center">
      <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
        Ghanaian Fashion House
      </span>
      <h1 className="font-sans text-5xl font-semibold tracking-wide text-foreground uppercase sm:text-7xl">
        Plasma Collections
      </h1>
      <p className="max-w-md text-base text-muted-foreground sm:text-lg">
        Premium clothes, shoes, and repairs — ordered straight through WhatsApp.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <CtaButton href="/catalogue">
          Browse Catalogue
          <ArrowRightIcon size={16} />
        </CtaButton>
        {chatHref && (
          <CtaButton href={chatHref} variant="outline" external>
            Chat on WhatsApp
          </CtaButton>
        )}
      </div>
    </section>
  )
}
