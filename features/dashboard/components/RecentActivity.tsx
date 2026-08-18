import type { Doc } from "@/convex/_generated/dataModel"

export function RecentActivity({ entries }: { entries: Doc<"auditLog">[] }) {
  return <>{entries.length}</>
}
