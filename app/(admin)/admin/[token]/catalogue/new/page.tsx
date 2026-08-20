import type { Metadata } from "next"
import { AddItemPage } from "@/components/pages/catalogue/AddItemPage"

export const metadata: Metadata = {
  title: "Add Item",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AddItemPage />
}
