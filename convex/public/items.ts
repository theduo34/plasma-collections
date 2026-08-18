// PUBLIC — no requireRole() calls in this file. This is intentional.
import { v } from "convex/values"
import { query } from "../_generated/server"

// Only returns visible items.
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("items")
      .withIndex("by_visible", (q) => q.eq("isVisible", true))
      .order("desc")
      .collect()
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
    return item
  },
})

export const listByCategory = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("isVisible"), true))
      .order("desc")
      .collect()
  },
})
