'use client'
import { can, type Permission } from "@/lib/permissions"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth()
  if (!user) return false
  return can(user.role, permission)
}
