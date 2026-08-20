import type { Metadata } from "next"
import { CataloguePage } from "@/components/pages/storefront/CataloguePage"

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Browse the full Plasma Collections catalogue — clothes, shoes, repairs, and accessories.",
  alternates: { canonical: "/catalogue" },
}

export default function Page() {
  return <CataloguePage />
}
