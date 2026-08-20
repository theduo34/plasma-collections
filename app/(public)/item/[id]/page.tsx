import type { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { ItemDetailPage } from "@/components/pages/storefront/ItemDetailPage"
import { SITE_URL } from "@/lib/site"
import type { Id } from "@/convex/_generated/dataModel"

async function getItem(id: string) {
  return await fetchQuery(api.public.items.get, { itemId: id as Id<"items"> }).catch(() => null)
}

export async function generateMetadata({ params }: PageProps<"/item/[id]">): Promise<Metadata> {
  const { id } = await params
  const item = await getItem(id)

  if (!item) {
    return { title: "Item not found" }
  }

  const description = item.description ?? `${item.name} — available now at Plasma Collections.`

  return {
    title: item.name,
    description,
    alternates: { canonical: `/item/${item._id}` },
    openGraph: {
      title: item.name,
      description,
      images: item.imageUrl ? [{ url: item.imageUrl }] : undefined,
    },
  }
}

export default async function Page({ params }: PageProps<"/item/[id]">) {
  const { id } = await params
  const item = await getItem(id)

  return (
    <>
      {item && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: item.name,
              description: item.description ?? undefined,
              image: item.imageUrls,
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/item/${item._id}`,
                priceCurrency: "GHS",
                price: (item.price / 100).toFixed(2),
                availability: item.inStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
            }),
          }}
        />
      )}
      <ItemDetailPage itemId={id as Id<"items">} />
    </>
  )
}
