import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  )
}
