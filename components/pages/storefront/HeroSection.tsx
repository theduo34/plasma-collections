import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import { CtaButton } from "@/components/pages/storefront/CtaButton"

export function HeroSection({ chatHref }: { chatHref?: string }) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-14 text-center">
      <span className="text-sm uppercase tracking-[0.3em] text-primary">
        Ghanaian Fashion House
      </span>
      <h1 className="font-sans text-4xl font-semibold tracking-wide text-foreground uppercase sm:text-6xl">
        Plasma Collections
      </h1>
      <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
        Premium clothes, shoes, and repair services — handpicked, then delivered straight to
        your WhatsApp chat. No account, no checkout, just a conversation.
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
