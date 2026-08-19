import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr"
import { CtaButton } from "@/components/pages/storefront/CtaButton"

export function CtaSection({ chatHref }: { chatHref?: string }) {
  if (!chatHref) return null

  return (
    <section className="dark hero-texture bg-background">
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center sm:py-28">
        <h2 className="font-sans text-3xl font-semibold tracking-wide text-foreground uppercase sm:text-4xl">
          Ready to shop?
        </h2>
        <p className="max-w-md text-base text-muted-foreground">
          We&apos;ll confirm availability and price right on WhatsApp.
        </p>
        <CtaButton href={chatHref} external>
          {/* WhatsApp's own mark, in its own green — a third-party brand icon we never recolor. */}
          <WhatsappLogoIcon className="text-whatsapp" size={20} weight="fill" />
          Message Us
        </CtaButton>
      </div>
    </section>
  )
}
