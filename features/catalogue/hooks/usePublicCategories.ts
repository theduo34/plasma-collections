'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function usePublicCategories() {
  return useQuery(api.public.categories.list, {})
}
