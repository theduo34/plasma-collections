'use client'
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { CaretUpDownIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/shared/Avatar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { usePermission } from "@/features/auth/hooks/usePermission"
import { api } from "@/convex/_generated/api"

function initialsFor(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

// The bottom-of-sidebar trigger — tapping it pops up settings/sign-out,
// same shape as the account menu at the bottom of most admin consoles.
export function AccountMenu() {
  const { user, isLoading } = useAuth()
  const { token } = useParams<{ token: string }>()
  const canConfigureSettings = usePermission("settings:configure")
  const { signOut } = useAuthActions()
  const revokeSessionToken = useMutation(api.sessionTokens.revoke)
  const router = useRouter()

  async function handleSignOut() {
    // Revoke first — the /admin/<token> URL dies immediately instead of
    // waiting out the 24h idle window. See convex/sessionTokens.ts.
    await revokeSessionToken({}).catch(() => {})
    await signOut()
    router.push("/")
  }

  if (isLoading || !user) {
    return <div className="flex h-11 items-center px-2 text-xs text-muted-foreground">Loading…</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent">
        <Avatar initials={initialsFor(user.name)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.role === "super-admin" ? "Super Admin" : "Admin"}
          </span>
        </div>
        <CaretUpDownIcon size={16} className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
          <span className="text-sm font-medium text-foreground">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canConfigureSettings && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/${token}/settings`}>
              <GearSixIcon />
              Settings
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <SignOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
