import type { Metadata } from "next"
import { DashboardPage } from "@/components/pages/dashboard/DashboardPage"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <DashboardPage />
}
