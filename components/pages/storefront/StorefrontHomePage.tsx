import Link from "next/link"
import { fetchQuery } from "convex/nextjs"
import {
  ArrowRightIcon,
  ScissorsIcon,
  SneakerIcon,
  SparkleIcon,
  TagIcon,
  TShirtIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr"
import { api } from "@/convex/_generated/api"
import { FeaturedItems } from "@/features/catalogue/components/FeaturedItems"

const CATEGORY_ICONS: Record<string, typeof TagIcon> = {
  clothes: TShirtIcon,
  shoes: SneakerIcon,
  repairs: ScissorsIcon,
}

export async function StorefrontHomePage() {
  const categories = await fetchQuery(api.public.categories.list, {}).catch(() => [])
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER
  const chatHref = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        "Hi! I'd like to know more about Plasma Collections."
      )}`
    : undefined

  return (
    <div className="flex flex-col">
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
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            Browse Catalogue
            <ArrowRightIcon size={16} />
          </Link>
          {chatHref && (
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-medium tracking-wide text-foreground uppercase transition-colors hover:border-primary"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-page section-y grid gap-8 sm:grid-cols-3">
          {[
            { icon: SparkleIcon, title: "Handpicked Quality", description: "Every piece is selected for craftsmanship, not volume." },
            { icon: WhatsappLogoIcon, title: "Order on WhatsApp", description: "No cart, no account — just message us to buy." },
            { icon: ScissorsIcon, title: "Repairs & Alterations", description: "Resoling, hemming, and leather restoration, done right." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center">
              <Icon className="text-primary" size={28} />
              <p className="text-base font-medium text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-t border-border">
          <div className="container-page section-y">
            <h2 className="mb-6 text-sm font-medium tracking-widest text-foreground uppercase">
              Shop by Category
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.map((category) => {
                const Icon = CATEGORY_ICONS[category.slug] ?? TagIcon
                return (
                  <Link
                    key={category._id}
                    href={`/catalogue?category=${category.slug}`}
                    className="group flex flex-col items-center gap-3 border border-border px-6 py-8 text-center transition-colors hover:border-primary"
                  >
                    <Icon className="text-primary" size={32} />
                    <span className="text-sm font-medium tracking-widest text-foreground uppercase">
                      {category.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border">
        <div className="container-page section-y">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-widest text-foreground uppercase">
              New In
            </h2>
            <Link
              href="/catalogue"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View full catalogue →
            </Link>
          </div>
          <FeaturedItems />
        </div>
      </section>

      {chatHref && (
        <section className="border-t border-border bg-secondary">
          <div className="container-page section-y flex flex-col items-center gap-4 text-center">
            <h2 className="font-sans text-2xl font-semibold tracking-wide text-foreground uppercase">
              Ready to shop?
            </h2>
            <p className="max-w-md text-base text-muted-foreground">
              Tell us what you&apos;re looking for and we&apos;ll confirm availability and price
              right on WhatsApp.
            </p>
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
            >
              {/* WhatsApp's own mark, in its own green — a third-party brand icon we never recolor. */}
              <WhatsappLogoIcon className="text-whatsapp" size={20} weight="fill" />
              Message Us
            </a>
          </div>
        </section>
      )}
    </div>
  )
}
