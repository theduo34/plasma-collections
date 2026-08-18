'use client'
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useItemMutations() {
  const create = useMutation(api.items.create)
  const update = useMutation(api.items.update)
  const remove = useMutation(api.items.remove)
  const toggleVisibility = useMutation(api.items.toggleVisibility)

  return { create, update, remove, toggleVisibility }
}
