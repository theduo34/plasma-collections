import { redirect } from "next/navigation"
import { fetchQuery } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"
import { AdminLayout } from "@/components/layout/AdminLayout"

// Defense in depth — requireRole() in Convex is the real security boundary.
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await fetchQuery(
    api.users.me,
    {},
    { token: await convexAuthNextjsToken() }
  ).catch(() => null)

  // Redirect home, not to the login page — see proxy.ts for why.
  if (!user) redirect("/")

  return <AdminLayout>{children}</AdminLayout>
}
