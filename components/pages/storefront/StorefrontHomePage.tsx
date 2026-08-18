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
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">
          Ghanaian Fashion House
        </span>
        <h1 className="font-sans text-3xl font-semibold tracking-wide text-foreground uppercase sm:text-5xl">
          Plasma Collections
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          Premium clothes, shoes, and repair services — handpicked, then delivered straight to
          your WhatsApp chat. No account, no checkout, just a conversation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            Browse Catalogue
            <ArrowRightIcon size={14} />
          </Link>
          {chatHref && (
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-medium tracking-wide text-foreground uppercase transition-colors hover:border-primary"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-3">
          {[
            { icon: SparkleIcon, title: "Handpicked Quality", description: "Every piece is selected for craftsmanship, not volume." },
            { icon: WhatsappLogoIcon, title: "Order on WhatsApp", description: "No cart, no account — just message us to buy." },
            { icon: ScissorsIcon, title: "Repairs & Alterations", description: "Resoling, hemming, and leather restoration, done right." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center">
              <Icon className="text-primary" size={24} />
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="mb-6 text-xs font-medium tracking-widest text-foreground uppercase">
              Shop by Category
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.map((category) => {
                const Icon = CATEGORY_ICONS[category.slug] ?? TagIcon
                return (
                  <Link
                    key={category._id}
                    href={`/catalogue?category=${category.slug}`}
                    className="group flex flex-col items-center gap-3 border border-border px-6 py-10 text-center transition-colors hover:border-primary"
                  >
                    <Icon className="text-primary" size={28} />
                    <span className="text-xs font-medium tracking-widest text-foreground uppercase">
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
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xs font-medium tracking-widest text-foreground uppercase">
              New In
            </h2>
            <Link
              href="/catalogue"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View full catalogue →
            </Link>
          </div>
          <FeaturedItems />
        </div>
      </section>

      {chatHref && (
        <section className="border-t border-border bg-secondary">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center">
            <h2 className="font-sans text-xl font-semibold tracking-wide text-foreground uppercase">
              Ready to shop?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Tell us what you&apos;re looking for and we&apos;ll confirm availability and price
              right on WhatsApp.
            </p>
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
            >
              {/* Only intentional exception to "semantic tokens only" */}
              <WhatsappLogoIcon className="text-[#25D366]" size={16} weight="fill" />
              Message Us
            </a>
          </div>
        </section>
      )}
    </div>
  )
}
