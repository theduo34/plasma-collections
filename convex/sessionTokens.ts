import { v } from "convex/values"
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server"
import { requireRole } from "./lib/auth"
import type { Id } from "./_generated/dataModel"

// The admin URL scheme is /admin/<token>/... — a secret separate from the
// Convex Auth session itself. It slides forward on every admin page visit
// and goes stale after this much idle time.
const SESSION_WINDOW_MS = 24 * 60 * 60 * 1000

async function currentTokenRow(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  return await ctx.db
    .query("sessionTokens")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique()
}

// Mints a fresh route token for the caller and deletes any token they
// already held — every login gets a brand-new admin URL, so a previously
// issued link (another tab, a past session) stops working immediately.
export const issue = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireRole(ctx, ["admin", "super-admin"])

    const existing = await currentTokenRow(ctx, user._id)
    if (existing) await ctx.db.delete(existing._id)

    const token = crypto.randomUUID()
    await ctx.db.insert("sessionTokens", {
      userId: user._id,
      token,
      lastActiveAt: Date.now(),
    })
    return token
  },
})

// Called by the /admin/[token] layout on every navigation. Confirms the
// URL's token still belongs to the caller and hasn't sat idle past the
// window, then slides the window forward. Returns false for a stale,
// reused, or mismatched token instead of throwing — the caller just
// redirects home.
export const touch = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireRole(ctx, ["admin", "super-admin"])

    const row = await ctx.db
      .query("sessionTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()

    if (!row || row.userId !== user._id) return false
    if (Date.now() - row.lastActiveAt > SESSION_WINDOW_MS) {
      await ctx.db.delete(row._id)
      return false
    }

    await ctx.db.patch(row._id, { lastActiveAt: Date.now() })
    return true
  },
})

// The caller's current admin URL token, or null if they don't have a live
// one. Used to send an already-logged-in visitor of the login page
// straight back into their session instead of re-showing the form.
export const current = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireRole(ctx, ["admin", "super-admin"])
    const row = await currentTokenRow(ctx, user._id)
    if (!row || Date.now() - row.lastActiveAt > SESSION_WINDOW_MS) return null
    return row.token
  },
})

// Called on sign-out — the URL dies immediately rather than waiting out
// the idle window.
export const revoke = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireRole(ctx, ["admin", "super-admin"])
    const existing = await currentTokenRow(ctx, user._id)
    if (existing) await ctx.db.delete(existing._id)
  },
})
