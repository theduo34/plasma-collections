import Link from "next/link"
import { cn } from "@/lib/utils"

const VARIANT_CLASSES = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border border-border text-foreground hover:border-primary",
} as const

type CtaButtonProps = {
  href: string
  variant?: keyof typeof VARIANT_CLASSES
  external?: boolean
  className?: string
  children: React.ReactNode
}

// Storefront marketing CTA — deliberately bigger/bolder than the compact
// admin-console Button in components/ui/button.tsx. Same job, different
// audience: this one has to work as a thumb target on a product page.
export function CtaButton({
  href,
  variant = "primary",
  external = false,
  className,
  children,
}: CtaButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors",
    VARIANT_CLASSES[variant],
    className
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
