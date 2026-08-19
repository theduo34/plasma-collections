import type { Doc } from "@/convex/_generated/dataModel"

export type Item = Doc<"items">
export type Category = Doc<"categories">

// Public storefront queries resolve imageStorageId(s) into servable URLs —
// admin-facing queries return the raw Doc without them. imageUrl is the
// first of imageUrls (thumbnail use); imageUrls is the full set for the
// item detail page carousel.
export type PublicItem = Item & { imageUrl: string | null; imageUrls: string[]; isNew: boolean }
export type PublicCategory = Category & { imageUrl: string | null }
