import { v } from "convex/values"
import { mutation, internalMutation, query } from "./_generated/server"
import { requireRole } from "./lib/auth"

// TODO: also create the Password auth account for this user.
export const createAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("super-admin")),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["super-admin"])
    throw new Error("Not implemented")
  },
})

// CLI-only bootstrap — must refuse to run once a super-admin already exists.
export const createSuperAdmin = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    throw new Error("Not implemented")
  },
})

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["admin", "super-admin"])
    throw new Error("Not implemented")
  },
})

// Deactivates, doesn't delete.
export const deactivateUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["super-admin"])
    throw new Error("Not implemented")
  },
})

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireRole(ctx, ["admin", "super-admin"])
    return user
  },
})
