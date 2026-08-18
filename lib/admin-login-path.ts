// Resolves the admin login URL from ADMIN_LOGIN_TOKEN so it's never a
// guessable literal like /login. Server-only — never import into a
// 'use client' file, or the token ships in the browser bundle.
export function getAdminLoginPath(): string {
  const token = process.env.ADMIN_LOGIN_TOKEN

  if (!token) {
    throw new Error(
      "ADMIN_LOGIN_TOKEN is not set. Generate a UUID and add it to .env.local — see .env.local.example."
    )
  }

  return `/${token}/login`
}
