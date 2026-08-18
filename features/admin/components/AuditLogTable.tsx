import type { Doc } from "@/convex/_generated/dataModel"

export function AuditLogTable({ entries }: { entries: Doc<"auditLog">[] }) {
  return <>{entries.length}</>
}
