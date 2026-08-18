import type { Doc } from "@/convex/_generated/dataModel"

export function UserTable({ users }: { users: Doc<"users">[] }) {
  return <>{users.length}</>
}
