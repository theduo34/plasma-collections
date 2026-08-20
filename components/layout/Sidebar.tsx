'use client'
import Link from "next/link"
import Image from "next/image"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePermission } from "@/features/auth/hooks/usePermission"
import { AccountMenu } from "@/features/auth/components/AccountMenu"
import { ADMIN_NAV_ITEMS } from "@/components/layout/admin-nav-items"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar({
  className,
  collapsed = false,
  onNavigate,
}: {
  className?: string
  collapsed?: boolean
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
        "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-sidebar-border px-5",
          collapsed && "justify-center px-3"
        )}
      >
        <Image src="/logo/logo.PNG" alt="" width={36} height={36} className="shrink-0 rounded-md" />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-sans text-sm font-semibold uppercase tracking-wide">
              Plasma Collections
            </span>
            <span className="text-xs text-muted-foreground">Admin Console</span>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ADMIN_NAV_ITEMS.filter((item) => !item.permission || permissions[item.permission]).map(
          (item) => {
            const href = `/admin/${token}/${item.segment}`
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            const linkClassName = cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-semibold transition-colors",
              collapsed && "justify-center px-0",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )

            if (collapsed) {
              return (
                <Tooltip key={item.segment}>
                  <TooltipTrigger asChild>
                    <Link href={href} onClick={onNavigate} className={linkClassName}>
                      <item.icon size={22} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.segment} href={href} onClick={onNavigate} className={linkClassName}>
                <item.icon size={22} />
                {item.label}
              </Link>
            )
          }
        )}
      </nav>

      <div className="flex h-16 items-center border-t border-sidebar-border px-3">
        <AccountMenu collapsed={collapsed} />
      </div>
    </aside>
  )
}
