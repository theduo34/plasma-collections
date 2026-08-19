'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { OrderCartContext } from "@/features/order/context/OrderCartContext"
import type { CartItem } from "@/features/order/types/cart"
import type { Id } from "@/convex/_generated/dataModel"

const STORAGE_KEY = "plasma-collections:cart"

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.itemId === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number"
  )
}

// Persisted to localStorage so a page refresh doesn't silently wipe out
// what someone added — only an explicit clear (checkout, or removing every
// item) should empty it. Wraps the public layout so the nav badge, item
// detail page, and order summary sheet all share one cart.
export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Reading localStorage has to happen in an effect, not the useState
  // initializer — it runs on the client only, after the server-rendered
  // (always-empty) markup has already been hydrated against.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        if (Array.isArray(parsed) && parsed.every(isCartItem)) {
          setItems(parsed)
        }
      } catch {
        // Corrupt or inaccessible storage — start with an empty cart.
      }
      setHydrated(true)
    })
  }, [])

  // Skip the very first write: it would fire before the load effect above
  // and overwrite a saved cart with the initial empty array.
  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

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
