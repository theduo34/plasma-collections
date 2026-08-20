import type { Metadata } from "next"
import { AdminUsersPage } from "@/components/pages/admin/AdminUsersPage"

export const metadata: Metadata = {
  title: "Users",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminUsersPage />
}
