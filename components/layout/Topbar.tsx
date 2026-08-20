import { SignOutButton } from "@/features/auth/components/SignOutButton"

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <SignOutButton />
    </header>
  )
}
