// PUBLIC — no requireRole() calls in this file. This is intentional.
import { v } from "convex/values"
import { query } from "../_generated/server"

// Only returns visible items.
export const list = query({
  args: {},
  handler: async (ctx) => {
    throw new Error("Not implemented")
  },
})

// Returns null if the item exists but isVisible is false.
export const get = query({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    throw new Error("Not implemented")
  },
})

export const listByCategory = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    throw new Error("Not implemented")
  },
})
