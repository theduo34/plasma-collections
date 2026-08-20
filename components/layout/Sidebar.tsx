'use client'
import Link from "next/link"
import Image from "next/image"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePermission } from "@/features/auth/hooks/usePermission"
import { AccountMenu } from "@/features/auth/components/AccountMenu"
import { ADMIN_NAV_ITEMS } from "@/components/layout/admin-nav-items"

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const { token } = useParams<{ token: string }>()
  const canManageUsers = usePermission("users:manage")
  const canConfigureSettings = usePermission("settings:configure")

  const permissions: Record<string, boolean> = {
    "users:manage": canManageUsers,
    "settings:configure": canConfigureSettings,
  }

  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <Image src="/logo/logo.PNG" alt="" width={36} height={36} className="rounded-md" />
        <div className="flex flex-col">
          <span className="font-sans text-sm font-semibold uppercase tracking-wide">
            Plasma Collections
          </span>
          <span className="text-xs text-muted-foreground">Admin Console</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ADMIN_NAV_ITEMS.filter((item) => !item.permission || permissions[item.permission]).map(
          (item) => {
            const href = `/admin/${token}/${item.segment}`
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={item.segment}
                href={href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          }
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <AccountMenu />
      </div>
    </aside>
  )
}
