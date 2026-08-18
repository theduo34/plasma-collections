import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireRole } from "./lib/auth"

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    categoryId: v.id("categories"),
    imageStorageId: v.optional(v.id("_storage")),
    inStock: v.boolean(),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const update = mutation({
  args: {
    itemId: v.id("items"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    imageStorageId: v.optional(v.id("_storage")),
    inStock: v.optional(v.boolean()),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const remove = mutation({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const toggleVisibility = mutation({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

// Returns all items, including hidden ones.
export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

export const get = query({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})
