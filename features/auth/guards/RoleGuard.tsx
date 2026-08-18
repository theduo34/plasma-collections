'use client'
import type { Role } from "@/lib/permissions"
import { useAuth } from "@/features/auth/hooks/useAuth"

// UI gate only — not the security boundary. requireRole() in Convex is.
export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[]
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  if (isLoading || !user || !allowedRoles.includes(user.role)) return null
  return children
}
