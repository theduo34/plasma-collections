import { StorefrontNav } from "@/components/layout/StorefrontNav"
import { StorefrontFooter } from "@/components/layout/StorefrontFooter"
import { OrderCartProvider } from "@/features/order/components/OrderCartProvider"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrderCartProvider>
      <StorefrontNav />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
    </OrderCartProvider>
  )
}
