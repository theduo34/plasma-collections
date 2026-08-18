import type { Metadata } from "next"
import { CataloguePage } from "@/components/pages/storefront/CataloguePage"

export const metadata: Metadata = {
  title: "Catalogue — Plasma Collections",
  description: "Browse the full Plasma Collections catalogue.",
}

export default function Page() {
  return <CataloguePage />
}
