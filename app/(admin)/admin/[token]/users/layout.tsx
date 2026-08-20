import { redirect } from "next/navigation"
import { fetchQuery } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"

// Defense in depth — requireRole(["super-admin"]) in Convex is the real
// security boundary. This just keeps a plain admin from loading the shell.
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const user = await fetchQuery(
    api.users.me,
    {},
    { token: await convexAuthNextjsToken() }
  ).catch(() => null)

  if (user?.role !== "super-admin") redirect(`/admin/${token}/dashboard`)

  return children
}
