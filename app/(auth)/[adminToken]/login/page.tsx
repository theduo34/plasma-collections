import type { Metadata } from "next"
import { LoginPage } from "@/components/pages/auth/LoginPage"

export const metadata: Metadata = {
  title: "Log in — Plasma Collections",
}

export default async function Page({ params }: PageProps<"/[adminToken]/login">) {
  const { adminToken } = await params
  return <LoginPage adminToken={adminToken} />
}
