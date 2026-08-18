'use client'
import type { Item } from "@/features/catalogue/types/item"

export function ItemForm({ item }: { item?: Item }) {
  return (
    <form className="flex flex-col gap-4">
      {/* TODO: React Hook Form + Zod, wired to convex/items.ts create/update */}
    </form>
  )
}
