import { internalMutation } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

const SEED_USER_EMAIL = "seed-script@plasma.internal"

const CATEGORIES = [
  { name: "Clothes", slug: "clothes", order: 0 },
  { name: "Shoes", slug: "shoes", order: 1 },
  { name: "Repairs", slug: "repairs", order: 2 },
] as const

const ITEMS: Array<{
  name: string
  description: string
  price: number // pesewas
  categorySlug: (typeof CATEGORIES)[number]["slug"]
  inStock: boolean
}> = [
  {
    name: "Kente-Trim Blazer",
    description: "Tailored wool blazer with a hand-woven kente trim along the lapel.",
    price: 45000,
    categorySlug: "clothes",
    inStock: true,
  },
  {
    name: "Ankara Wrap Dress",
    description: "Bold-print wrap dress cut from premium Ankara cotton.",
    price: 28000,
    categorySlug: "clothes",
    inStock: false,
  },
  {
    name: "Classic White Shirt",
    description: "Crisp cotton poplin shirt, tailored fit.",
    price: 15000,
    categorySlug: "clothes",
    inStock: true,
  },
  {
    name: "Tailored Trousers",
    description: "Slim-fit trousers in brushed cotton twill.",
    price: 22000,
    categorySlug: "clothes",
    inStock: true,
  },
  {
    name: "Handcrafted Leather Loafers",
    description: "Full-grain leather loafers, hand-stitched sole.",
    price: 38000,
    categorySlug: "shoes",
    inStock: true,
  },
  {
    name: "Suede Chelsea Boots",
    description: "Classic Chelsea silhouette in soft suede.",
    price: 42000,
    categorySlug: "shoes",
    inStock: true,
  },
  {
    name: "Woven Sandals",
    description: "Hand-woven leather strap sandals.",
    price: 18000,
    categorySlug: "shoes",
    inStock: true,
  },
  {
    name: "Shoe Resoling Service",
    description: "Full resole and heel replacement for leather footwear.",
    price: 8000,
    categorySlug: "repairs",
    inStock: true,
  },
  {
    name: "Garment Alteration",
    description: "Hemming, taking in, or letting out — priced per garment.",
    price: 6000,
    categorySlug: "repairs",
    inStock: true,
  },
  {
    name: "Leather Restoration",
    description: "Deep clean, condition, and recolor for leather goods.",
    price: 10000,
    categorySlug: "repairs",
    inStock: true,
  },
]

// Dev-only fixture data — refuses to run if the catalogue isn't empty, so it
// can never clobber real categories/items added later via the admin console.
export const seedStorefront = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingCategory = await ctx.db.query("categories").first()
    if (existingCategory !== null) {
      throw new Error("Categories already exist — seedStorefront only runs against an empty catalogue.")
    }

    let seedUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", SEED_USER_EMAIL))
      .unique()

    if (seedUser === null) {
      const seedUserId = await ctx.db.insert("users", {
        email: SEED_USER_EMAIL,
        name: "Seed Script (do not use)",
        role: "admin",
        isActive: false,
      })
      seedUser = await ctx.db.get(seedUserId)
    }

    const categoryIds = {} as Record<(typeof CATEGORIES)[number]["slug"], Id<"categories">>
    for (const category of CATEGORIES) {
      categoryIds[category.slug] = await ctx.db.insert("categories", category)
    }

    const now = Date.now()
    for (const item of ITEMS) {
      await ctx.db.insert("items", {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: categoryIds[item.categorySlug],
        inStock: item.inStock,
        isVisible: true,
        createdBy: seedUser!._id,
        createdAt: now,
        updatedAt: now,
      })
    }
  },
})
