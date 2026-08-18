import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireRole } from "./lib/auth"

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const update = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const remove = mutation({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})
