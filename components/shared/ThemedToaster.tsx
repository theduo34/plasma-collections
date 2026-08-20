'use client'
import { useTheme } from "next-themes"
import { Toaster } from "sonner"

// Keeps sonner's toast styling in sync with the light/dark toggle instead
// of always rendering a light toast against a dark admin page. richColors
// tints each toast by type (success green, error red, etc.) so the color
// itself communicates what kind of toast it is — pair with a short
// title + description in each toast() call, not one long string.
export function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return (
    <Toaster theme={resolvedTheme === "dark" ? "dark" : "light"} position="top-center" richColors />
  )
}
