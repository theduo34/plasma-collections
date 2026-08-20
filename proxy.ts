import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { getAdminLoginPath } from "@/lib/admin-login-path"

// All admin routes live at /admin/<token>/... — the token itself is
// validated deeper in app/(admin)/admin/[token]/layout.tsx (see
// convex/sessionTokens.ts). This just gates on being logged in at all.
const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isLoginRoute = createRouteMatcher([getAdminLoginPath()])

export default convexAuthNextjsMiddleware(async (request) => {
  // Unauthenticated visitors to protected routes go home, never to the
  // login page — redirecting them there would advertise its secret URL.
  if (isAdminRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/")
  }
  if (isLoginRoute(request) && (await isAuthenticatedNextjs())) {
    const token = await fetchQuery(
      api.sessionTokens.current,
      {},
      { token: await convexAuthNextjsToken() }
    ).catch(() => null)
    return nextjsMiddlewareRedirect(request, token ? `/admin/${token}/dashboard` : "/")
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
