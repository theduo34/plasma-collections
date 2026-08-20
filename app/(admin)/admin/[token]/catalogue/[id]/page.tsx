import type { Metadata } from "next"
import { EditItemPage } from "@/components/pages/catalogue/EditItemPage"
import type { Id } from "@/convex/_generated/dataModel"

export const metadata: Metadata = {
  title: "Edit Item",
  robots: { index: false, follow: false },
}

export default async function Page({ params }: PageProps<"/admin/[token]/catalogue/[id]">) {
  const { id } = await params
  return <EditItemPage itemId={id as Id<"items">} />
}
