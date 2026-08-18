import { PageHeader } from "@/components/shared/PageHeader"
import type { Id } from "@/convex/_generated/dataModel"

export function ItemDetailPage({ itemId }: { itemId: Id<"items"> }) {
  return (
    <div className="p-6">
      <PageHeader title="Item" />
    </div>
  )
}
