import type { MetadataRoute } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await fetchQuery(api.public.items.list, {}).catch(() => [])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogue`, changeFrequency: "daily", priority: 0.9 },
  ]

  const itemRoutes: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${SITE_URL}/item/${item._id}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...itemRoutes]
}
