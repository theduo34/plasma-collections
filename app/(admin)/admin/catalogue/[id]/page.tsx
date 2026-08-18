import type { Metadata } from "next"
import { EditItemPage } from "@/components/pages/catalogue/EditItemPage"
import type { Id } from "@/convex/_generated/dataModel"

export const metadata: Metadata = {
  title: "Edit Item — Plasma Collections Admin",
}

export default async function Page({ params }: PageProps<"/admin/catalogue/[id]">) {
  const { id } = await params
  return <EditItemPage itemId={id as Id<"items">} />
}
