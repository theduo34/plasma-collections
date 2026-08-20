import type { Metadata } from "next"
import { AdminSettingsPage } from "@/components/pages/admin/AdminSettingsPage"

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminSettingsPage />
}
