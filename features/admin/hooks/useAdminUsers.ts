'use client'
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useAdminUsers() {
  const users = useQuery(api.users.listUsers, {})
  const createAdmin = useMutation(api.users.createAdmin)
  const deactivateUser = useMutation(api.users.deactivateUser)

  return { users, createAdmin, deactivateUser }
}
