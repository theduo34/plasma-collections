import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"
import { getAdminLoginPath } from "@/lib/admin-login-path"

const isAdminRoute = createRouteMatcher(["/dashboard", "/admin(.*)"])
const isLoginRoute = createRouteMatcher([getAdminLoginPath()])

export default convexAuthNextjsMiddleware(async (request) => {
  // Unauthenticated visitors to protected routes go home, never to the
  // login page — redirecting them there would advertise its secret URL.
  if (isAdminRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/")
  }
  if (isLoginRoute(request) && (await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/dashboard")
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
