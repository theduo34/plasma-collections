import { PageHeader } from "@/components/shared/PageHeader"
import type { Id } from "@/convex/_generated/dataModel"

export function EditItemPage({ itemId }: { itemId: Id<"items"> }) {
  return (
    <div>
      <PageHeader title="Edit Item" />
    </div>
  )
}
