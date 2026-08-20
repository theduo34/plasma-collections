import { v } from "convex/values"
import { createAccount } from "@convex-dev/auth/server"
import { mutation, internalAction, internalQuery, query } from "./_generated/server"
import { internal } from "./_generated/api"
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

// Not reachable from client code — internal only, invoked via `convex run`.
export const hasSuperAdmin = internalQuery({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "super-admin"))
      .first()
    return existing !== null
  },
})

// CLI-only bootstrap — must refuse to run once a super-admin already exists.
// An action, not a mutation: createAccount() needs an action ctx to hash the
// password and write the user + authAccounts rows.
export const createSuperAdmin = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (await ctx.runQuery(internal.users.hasSuperAdmin, {})) {
      throw new Error("A super-admin already exists — createSuperAdmin only runs once.")
    }
    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters.")
    }

    await createAccount(ctx, {
      provider: "password",
      account: { id: args.email, secret: args.password },
      profile: {
        email: args.email,
        name: args.name,
        role: "super-admin",
        isActive: true,
      },
    })
  },
})

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["super-admin"])
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
