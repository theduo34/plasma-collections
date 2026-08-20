'use client'
import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useTheme } from "next-themes"
import { CaretUpDownIcon, GearSixIcon, MoonIcon, SignOutIcon, SunIcon } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/shared/Avatar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { usePermission } from "@/features/auth/hooks/usePermission"
import { adminSessionCache } from "@/features/auth/utils/adminSessionCache"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"

const subscribeNever = () => () => {}

// Animates the light/dark swap as a circle expanding from the toggle row
// itself, via the View Transitions API (see the theme-reveal keyframes
// in app/globals.css). Origin is the element's own center rather than a
// raw click point so it works the same for a mouse click or a keyboard
// Enter. Browsers without View Transitions just swap instantly.
function toggleThemeWithTransition(origin: Element, next: string, setTheme: (theme: string) => void) {
  const rect = origin.getBoundingClientRect()
  document.documentElement.style.setProperty("--theme-toggle-x", `${rect.left + rect.width / 2}px`)
  document.documentElement.style.setProperty("--theme-toggle-y", `${rect.top + rect.height / 2}px`)

  if (typeof document.startViewTransition !== "function") {
    setTheme(next)
    return
  }
  document.startViewTransition(() => setTheme(next))
}

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
export function AccountMenu({ collapsed = false }: { collapsed?: boolean }) {
  const { user, isLoading } = useAuth()
  const { token } = useParams<{ token: string }>()
  const canConfigureSettings = usePermission("settings:configure")
  const { signOut } = useAuthActions()
  const revokeSessionToken = useMutation(api.sessionTokens.revoke)
  const router = useRouter()
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  // Theme is unknown until after hydration — the mounted check avoids a
  // server/client mismatch on the icon shown.
  const themeMounted = useSyncExternalStore(subscribeNever, () => true, () => false)
  const isDark = themeMounted && resolvedTheme === "dark"

  async function handleSignOut() {
    // Revoke first — the /admin/<token> URL dies immediately instead of
    // waiting out the 24h idle window. See convex/sessionTokens.ts.
    await revokeSessionToken({}).catch(() => {})
    adminSessionCache.clear()
    await signOut()
    router.push("/")
  }

  if (isLoading || !user) {
    return (
      <div
        className={cn(
          "flex h-11 items-center px-2 text-xs text-muted-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        {!collapsed && "Loading…"}
      </div>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
        >
          <Avatar initials={initialsFor(user.name)} />
          {!collapsed && (
            <>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.role === "super-admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
              <CaretUpDownIcon size={16} className="shrink-0 text-muted-foreground" />
            </>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side={collapsed ? "right" : "top"} className="w-80">
          <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-3">
            <span className="text-base font-semibold text-foreground">{user.name}</span>
            <span className="truncate text-sm font-normal text-muted-foreground">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canConfigureSettings && (
            <DropdownMenuItem asChild className="gap-3 px-3 py-3 text-sm">
              <Link href={`/admin/${token}/settings`}>
                <GearSixIcon size={18} />
                Settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={!themeMounted}
            className="gap-3 px-3 py-3 text-sm"
            onSelect={(event) => {
              event.preventDefault()
              toggleThemeWithTransition(event.currentTarget as Element, isDark ? "light" : "dark", setTheme)
            }}
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            {isDark ? "Light theme" : "Dark theme"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="gap-3 px-3 py-3 text-sm"
            onSelect={(event) => {
              event.preventDefault()
              setConfirmSignOutOpen(true)
            }}
          >
            <SignOutIcon size={18} />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmSignOutOpen}
        onOpenChange={setConfirmSignOutOpen}
        title="Sign out?"
        description="You'll need to log in again to get back into the admin console."
        confirmLabel="Sign out"
        variant="destructive"
        onConfirm={handleSignOut}
      />
    </>
  )
}
