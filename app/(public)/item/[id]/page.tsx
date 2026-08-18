import type { Metadata } from "next"
import { ItemDetailPage } from "@/components/pages/storefront/ItemDetailPage"
import type { Id } from "@/convex/_generated/dataModel"

export const metadata: Metadata = {
  title: "Item — Plasma Collections",
}

export default async function Page({ params }: PageProps<"/item/[id]">) {
  const { id } = await params
  return <ItemDetailPage itemId={id as Id<"items">} />
}
