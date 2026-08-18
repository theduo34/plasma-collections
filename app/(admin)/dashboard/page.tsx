import type { Metadata } from "next"
import { DashboardPage } from "@/components/pages/dashboard/DashboardPage"

export const metadata: Metadata = {
  title: "Dashboard — Plasma Collections",
}

export default function Page() {
  return <DashboardPage />
}
