'use client'
import { useState } from "react"
import type { OrderItem } from "@/features/order/utils/buildWhatsAppMessage"

// In-memory only — no persistence for MVP.
export function useOrderCart() {
  const [items, setItems] = useState<OrderItem[]>([])
  return { items, setItems }
}
