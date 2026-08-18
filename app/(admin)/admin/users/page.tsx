import type { Metadata } from "next"
import { AdminUsersPage } from "@/components/pages/admin/AdminUsersPage"

export const metadata: Metadata = {
  title: "Users — Plasma Collections Admin",
}

export default function Page() {
  return <AdminUsersPage />
}
