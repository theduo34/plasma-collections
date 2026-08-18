// PUBLIC — no requireRole() calls in this file. This is intentional.
import { v } from "convex/values"
import { query, type QueryCtx } from "../_generated/server"
import type { Doc } from "../_generated/dataModel"

async function withImageUrl(ctx: QueryCtx, item: Doc<"items">) {
  const imageUrl = item.imageStorageId ? await ctx.storage.getUrl(item.imageStorageId) : null
  return { ...item, imageUrl }
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

export const listByCategory = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("items")
      .withIndex("by_category_and_visibility", (q) =>
        q.eq("categoryId", args.categoryId).eq("isVisible", true)
      )
      .order("desc")
      .collect()
    return await Promise.all(items.map((item) => withImageUrl(ctx, item)))
  },
})
