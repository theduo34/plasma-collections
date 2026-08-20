'use client'
import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Topbar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
        <main className="flex-1 bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
