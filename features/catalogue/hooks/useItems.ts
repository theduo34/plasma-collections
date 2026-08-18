'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useItems() {
  return useQuery(api.items.list, {})
}
