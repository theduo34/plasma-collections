// PUBLIC — no requireRole() calls in this file. This is intentional.
import { v } from "convex/values"
import { paginationOptsValidator } from "convex/server"
import { query, type QueryCtx } from "../_generated/server"
import type { Doc } from "../_generated/dataModel"

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

async function withImageUrl(ctx: QueryCtx, item: Doc<"items">) {
  const storageIds = item.imageStorageIds ?? []
  const resolved = await Promise.all(storageIds.map((id) => ctx.storage.getUrl(id)))
  const imageUrls = resolved.filter((url): url is string => url !== null)
  const isNew = Date.now() - item.createdAt < NEW_WINDOW_MS
  return { ...item, imageUrls, imageUrl: imageUrls[0] ?? null, isNew }
}

// Only returns visible items.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("items")
      .withIndex("by_visible", (q) => q.eq("isVisible", true))
      .order("desc")
      .collect()
    return await Promise.all(items.map((item) => withImageUrl(ctx, item)))
  },
})

// Returns null if the item exists but isVisible is false.
export const get = query({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)
    if (item === null || !item.isVisible) return null
    return await withImageUrl(ctx, item)
  },
})

// Powers each catalogue category row: an initial batch loads with the row,
// then more pages load as the user pages through it with the next arrow.
export const listByCategoryPage = query({
  args: {
    categoryId: v.id("categories"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("items")
      .withIndex("by_category_and_visibility", (q) =>
        q.eq("categoryId", args.categoryId).eq("isVisible", true)
      )
      .order("desc")
      .paginate(args.paginationOpts)
    const page = await Promise.all(result.page.map((item) => withImageUrl(ctx, item)))
    return { ...result, page }
  },
})
