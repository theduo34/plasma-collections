import type { Id } from "@/convex/_generated/dataModel"

export interface CartItem {
  itemId: Id<"items">
  name: string
  price: number // pesewas
  quantity: number
}
