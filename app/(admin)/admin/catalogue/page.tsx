import type { Metadata } from "next"
import { AdminCataloguePage } from "@/components/pages/catalogue/AdminCataloguePage"

export const metadata: Metadata = {
  title: "Catalogue — Plasma Collections Admin",
}

export default function Page() {
  return <AdminCataloguePage />
}
