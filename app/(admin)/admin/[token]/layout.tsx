import { redirect } from "next/navigation"
import { fetchMutation } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"

// The URL's token is a per-login secret, separate from the Convex Auth
// session itself (see convex/sessionTokens.ts) — reissued on every login
// and expired after 24h idle. A stale, reused, or mismatched token redirects
// home instead of loading, same as an unauthenticated visit.
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const isValid = await fetchMutation(
    api.sessionTokens.touch,
    { token },
    { token: await convexAuthNextjsToken() }
  ).catch(() => false)

  if (!isValid) redirect("/")

  return children
}
