import Link from "next/link"
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr"

export function StorefrontNav() {
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-sans text-base font-semibold uppercase tracking-[0.2em] text-foreground"
        >
          Plasma Collections
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/catalogue"
            className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalogue
          </Link>
          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            >
              {/* WhatsApp's own mark, in its own green — a third-party brand icon we never recolor. */}
              <WhatsappLogoIcon className="text-whatsapp" size={22} weight="fill" />
            </a>
          )}
        </div>
      </nav>
    </header>
  )
}
