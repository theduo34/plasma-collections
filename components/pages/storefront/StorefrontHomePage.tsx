import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { HeroSection } from "@/components/pages/storefront/HeroSection"
import { ValuePropsSection } from "@/components/pages/storefront/ValuePropsSection"
import { CategoryHighlights } from "@/components/pages/storefront/CategoryHighlights"
import { FeaturedSection } from "@/components/pages/storefront/FeaturedSection"
import { CtaSection } from "@/components/pages/storefront/CtaSection"

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
      <HeroSection chatHref={chatHref} />
      <ValuePropsSection />
      <CategoryHighlights categories={categories} />
      <FeaturedSection />
      <CtaSection chatHref={chatHref} />
    </div>
  )
}
