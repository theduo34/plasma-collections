import type { Metadata } from "next"
import { AdminSettingsPage } from "@/components/pages/admin/AdminSettingsPage"

export const metadata: Metadata = {
  title: "Settings — Plasma Collections Admin",
}

export default function Page() {
  return <AdminSettingsPage />
}
