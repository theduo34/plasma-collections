'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { SignOutIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"

// Closing the session revokes the /admin/<token> URL immediately, rather
// than leaving it to expire on its own after 24h idle — see
// convex/sessionTokens.ts.
export function SignOutButton() {
  const { signOut } = useAuthActions()
  const revokeSessionToken = useMutation(api.sessionTokens.revoke)
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    await revokeSessionToken({}).catch(() => {})
    await signOut()
    router.push("/")
  }

  return (
    <Button variant="ghost" size="sm" disabled={isSigningOut} onClick={handleSignOut} data-icon="inline-start">
      <SignOutIcon />
      Sign out
    </Button>
  )
}
