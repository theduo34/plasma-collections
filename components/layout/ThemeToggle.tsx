'use client'
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

const subscribeNever = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // Theme is unknown until after hydration — render a neutral placeholder
  // rather than guess and risk a mismatch with the client's real value.
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <SunIcon size={20} />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </Button>
  )
}
