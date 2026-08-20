import type { Metadata } from "next"
import { AdminCataloguePage } from "@/components/pages/catalogue/AdminCataloguePage"

export const metadata: Metadata = {
  title: "Catalogue",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminCataloguePage />
}
