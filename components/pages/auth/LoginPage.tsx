import { notFound } from "next/navigation"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { LoginForm } from "@/features/auth/components/LoginForm"

// The URL segment is checked against ADMIN_LOGIN_TOKEN — anything else 404s,
// same as any other unmatched route. This is what keeps the login page off /login.
export function LoginPage({ adminToken }: { adminToken: string }) {
  if (adminToken !== process.env.ADMIN_LOGIN_TOKEN) {
    notFound()
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
