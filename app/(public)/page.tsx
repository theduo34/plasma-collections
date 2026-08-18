import type { Metadata } from "next"
import { StorefrontHomePage } from "@/components/pages/storefront/StorefrontHomePage"

export const metadata: Metadata = {
  title: "Plasma Collections",
  description: "Premium Ghanaian fashion — clothes, shoes, and repairs.",
}

export default function Page() {
  return <StorefrontHomePage />
}
