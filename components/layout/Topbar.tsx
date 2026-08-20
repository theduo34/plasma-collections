'use client'
import { useState } from "react"
import { usePathname, useParams } from "next/navigation"
import { ListIcon, SidebarSimpleIcon, BellIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/shared/EmptyState"
import { Sidebar } from "@/components/layout/Sidebar"
import { ADMIN_NAV_ITEMS } from "@/components/layout/admin-nav-items"

export function Topbar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()
  const { token } = useParams<{ token: string }>()

  const activeItem = ADMIN_NAV_ITEMS.find((item) =>
    pathname.startsWith(`/admin/${token}/${item.segment}`)
  )

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        className="lg:hidden"
        onClick={() => setMobileNavOpen(true)}
      >
        <ListIcon size={20} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse}
      >
        <SidebarSimpleIcon size={20} />
      </Button>

      <span className="font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
        {activeItem?.label}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="ml-auto">
            <BellIcon size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <EmptyState title="No notifications yet" description="You're all caught up." className="py-6" />
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 border-r-0 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  )
}
