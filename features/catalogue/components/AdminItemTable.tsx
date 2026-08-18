import type { Item } from "@/features/catalogue/types/item"

export function AdminItemTable({ items }: { items: Item[] }) {
  // TODO: build on components/shared/DataTable.
  return <>{items.length}</>
}
