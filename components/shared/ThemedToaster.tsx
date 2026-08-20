'use client'
import { useTheme } from "next-themes"
import { Toaster } from "sonner"

// Keeps sonner's toast styling in sync with the light/dark toggle instead
// of always rendering a light toast against a dark admin page.
export function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster theme={resolvedTheme === "dark" ? "dark" : "light"} position="top-center" />
}
