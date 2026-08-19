import { v } from "convex/values"
import { internalAction, internalMutation, internalQuery, type ActionCtx } from "./_generated/server"
import { internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"

// Dev-only: fills in item/category photos from a placeholder image service
// so the storefront can be previewed with real imagery before the admin
// upload flow exists. Goes through the real ctx.storage pipeline — nothing
// here needs to be ripped out once admins start uploading real photos, it
// just stops finding anything left to fill in. Safe to re-run.

const IMAGES_PER_ITEM = 3

async function fetchAndStore(ctx: ActionCtx, seed: string): Promise<Id<"_storage">> {
  const response = await fetch(`https://picsum.photos/seed/${encodeURIComponent(seed)}/900/900`)
  if (!response.ok) {
    throw new Error(`Placeholder image fetch failed for seed "${seed}": ${response.status}`)
  }
  const blob = await response.blob()
  return await ctx.storage.store(blob)
}

export const seedPlaceholderImages = internalAction({
  args: {},
  handler: async (ctx) => {
    const itemIds = await ctx.runQuery(internal.seedImages.listItemsWithoutImage, {})
    for (const itemId of itemIds) {
      const storageIds = await Promise.all(
        Array.from({ length: IMAGES_PER_ITEM }, (_, index) => fetchAndStore(ctx, `${itemId}-${index}`))
      )
      await ctx.runMutation(internal.seedImages.setItemImages, { itemId, storageIds })
    }

    const categoryIds = await ctx.runQuery(internal.seedImages.listCategoriesWithoutImage, {})
    for (const categoryId of categoryIds) {
      const storageId = await fetchAndStore(ctx, categoryId)
      await ctx.runMutation(internal.seedImages.setCategoryImage, { categoryId, storageId })
    }
  },
})

export const listItemsWithoutImage = internalQuery({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("items").collect()
    return items.filter((item) => !item.imageStorageIds?.length).map((item) => item._id)
  },
})

export const listCategoriesWithoutImage = internalQuery({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect()
    return categories.filter((category) => !category.imageStorageId).map((category) => category._id)
  },
})

export const setItemImages = internalMutation({
  args: { itemId: v.id("items"), storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, { imageStorageIds: args.storageIds })
  },
})

export const setCategoryImage = internalMutation({
  args: { categoryId: v.id("categories"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.categoryId, { imageStorageId: args.storageId })
  },
})
