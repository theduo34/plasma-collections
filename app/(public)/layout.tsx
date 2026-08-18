import { StorefrontNav } from "@/components/layout/StorefrontNav"
import { StorefrontFooter } from "@/components/layout/StorefrontFooter"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StorefrontNav />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
    </>
  )
}
