'use client'

import { useContext } from "react"
import { OrderCartContext } from "@/features/order/context/OrderCartContext"

export function useOrderCart() {
  const context = useContext(OrderCartContext)
  if (!context) throw new Error("useOrderCart must be used within OrderCartProvider")
  return context
}
