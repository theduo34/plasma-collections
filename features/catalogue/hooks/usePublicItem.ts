'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export function usePublicItem(itemId: Id<"items">) {
  return useQuery(api.public.items.get, { itemId })
}
