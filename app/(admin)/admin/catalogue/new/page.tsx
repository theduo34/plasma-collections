import type { Metadata } from "next"
import { AddItemPage } from "@/components/pages/catalogue/AddItemPage"

export const metadata: Metadata = {
  title: "Add Item — Plasma Collections Admin",
}

export default function Page() {
  return <AddItemPage />
}
