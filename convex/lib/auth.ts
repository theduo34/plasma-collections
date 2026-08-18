import { QueryCtx, MutationCtx } from "../_generated/server"
import type { Role } from "@/lib/permissions"

export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  allowedRoles: Role[]
) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Unauthorized")

  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .unique()

  if (!user || !user.isActive || !allowedRoles.includes(user.role as Role)) {
    throw new Error("Forbidden")
  }

  return user
}
