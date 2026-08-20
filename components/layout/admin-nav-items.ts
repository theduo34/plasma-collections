'use client'
import {
  SquaresFourIcon,
  ShoppingBagIcon,
  UsersIcon,
  GearSixIcon,
  type Icon,
} from "@phosphor-icons/react"
import type { Permission } from "@/lib/permissions"

export type AdminNavItem = {
  segment: string
  label: string
  icon: Icon
  permission?: Permission
}

// Shared by Sidebar (renders the links) and Topbar (shows the active
// section as a wayfinding label) so the two never drift apart.
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { segment: "dashboard", label: "Dashboard", icon: SquaresFourIcon },
  { segment: "catalogue", label: "Catalogue", icon: ShoppingBagIcon },
  { segment: "users", label: "Users", icon: UsersIcon, permission: "users:manage" },
  { segment: "settings", label: "Settings", icon: GearSixIcon, permission: "settings:configure" },
]
