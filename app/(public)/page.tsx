import type { Metadata } from "next"
import { StorefrontHomePage } from "@/components/pages/storefront/StorefrontHomePage"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function Page() {
  return <StorefrontHomePage />
}
