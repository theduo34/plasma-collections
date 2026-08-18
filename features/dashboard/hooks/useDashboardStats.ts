'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useDashboardStats() {
  const items = useQuery(api.items.list, {})

  return {
    totalItems: items?.length ?? 0,
    inStock: items?.filter((item) => item.inStock).length ?? 0,
  }
}
