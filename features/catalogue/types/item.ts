import type { Doc } from "@/convex/_generated/dataModel"

export type Item = Doc<"items">
export type Category = Doc<"categories">

// Public storefront queries resolve imageStorageId into a servable URL —
// admin-facing queries return the raw Doc without it.
export type PublicItem = Item & { imageUrl: string | null }
export type PublicCategory = Category & { imageUrl: string | null }
