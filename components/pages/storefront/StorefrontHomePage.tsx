import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { HeroSection } from "@/components/pages/storefront/HeroSection"
import { StatementSection } from "@/components/pages/storefront/StatementSection"
import { CategoryHighlights } from "@/components/pages/storefront/CategoryHighlights"
import { FeaturedSection } from "@/components/pages/storefront/FeaturedSection"
import { CtaSection } from "@/components/pages/storefront/CtaSection"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

function buildChatHref(phoneNumber: string | undefined) {
  if (!phoneNumber) return undefined
  const greeting = "Hi! I'd like to know more about Plasma Collections."
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(greeting)}`
}

export async function StorefrontHomePage() {
  const categories = await fetchQuery(api.public.categories.list, {}).catch(() => [])
  const chatHref = buildChatHref(process.env.NEXT_PUBLIC_WA_NUMBER)

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            url: SITE_URL,
            image: `${SITE_URL}/opengraph-image.png`,
          }),
        }}
      />
      <HeroSection />
      <StatementSection />
      <CategoryHighlights categories={categories} />
      <FeaturedSection />
      <CtaSection chatHref={chatHref} />
    </div>
  )
}
