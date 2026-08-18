// PUBLIC — no requireRole() calls in this file. This is intentional.
// Categories aren't sensitive; the storefront nav and homepage need them
// without an authenticated caller.
import { query } from "../_generated/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect()
    const sorted = categories.sort((a, b) => a.order - b.order)
    return await Promise.all(
      sorted.map(async (category) => ({
        ...category,
        imageUrl: category.imageStorageId ? await ctx.storage.getUrl(category.imageStorageId) : null,
      }))
    )
  },
})
