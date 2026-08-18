import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,

  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("super-admin")),
    createdBy: v.optional(v.id("users")),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  categories: defineTable({
    name: v.string(),                          // e.g. "Clothes", "Shoes", "Repairs"
    slug: v.string(),                          // e.g. "clothes", "shoes", "repairs"
    order: v.number(),                         // display order
  }).index("by_slug", ["slug"]),

  items: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),                         // in GHS pesewas (multiply by 100) — future-proofs Paystack
    categoryId: v.id("categories"),
    imageStorageId: v.optional(v.id("_storage")),
    inStock: v.boolean(),
    isVisible: v.boolean(),                    // admin can hide without deleting
    createdBy: v.id("users"),
    updatedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_visible", ["isVisible"])
    .index("by_stock", ["inStock"])
    // Storefront category pages filter by both fields — a compound index
    // avoids reading every item in a category just to discard hidden ones.
    .index("by_category_and_visibility", ["categoryId", "isVisible"]),

  auditLog: defineTable({
    action: v.string(),                        // e.g. "item.create", "item.delete", "user.deactivate"
    performedBy: v.id("users"),
    targetId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_performer", ["performedBy"]),
})
