'use client'

import { useCallback, useMemo, useState } from "react"
import { OrderCartContext } from "@/features/order/context/OrderCartContext"
import type { CartItem } from "@/features/order/types/cart"
import type { Id } from "@/convex/_generated/dataModel"

// In-memory only — no persistence for MVP. Wraps the public layout so the
// nav badge, item detail page, and order summary sheet all share one cart.
export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId)
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((itemId: Id<"items">) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: Id<"items">, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.itemId !== itemId)
        : prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, count, addItem, removeItem, updateQuantity, clear }),
    [items, count, addItem, removeItem, updateQuantity, clear]
  )

  return <OrderCartContext.Provider value={value}>{children}</OrderCartContext.Provider>
}
