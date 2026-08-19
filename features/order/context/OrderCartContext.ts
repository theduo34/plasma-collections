import { createContext } from "react"
import type { CartItem } from "@/features/order/types/cart"
import type { Id } from "@/convex/_generated/dataModel"

export interface OrderCartValue {
  items: CartItem[]
  count: number
  addItem: (item: CartItem) => void
  removeItem: (itemId: Id<"items">) => void
  updateQuantity: (itemId: Id<"items">, quantity: number) => void
  clear: () => void
}

export const OrderCartContext = createContext<OrderCartValue | null>(null)
