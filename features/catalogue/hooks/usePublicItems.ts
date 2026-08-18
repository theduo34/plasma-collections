'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function usePublicItems() {
  return useQuery(api.public.items.list, {})
}
