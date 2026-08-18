'use client'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useAuth() {
  const user = useQuery(api.users.me, {})
  return { user, isLoading: user === undefined }
}
