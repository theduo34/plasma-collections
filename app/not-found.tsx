import type { Metadata } from "next"
import { CtaButton } from "@/components/pages/storefront/CtaButton"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <span className="text-sm uppercase tracking-[0.35em] text-primary">Plasma Collections</span>
      <h1 className="font-sans text-7xl font-bold tracking-wide text-foreground uppercase sm:text-8xl">
        404
      </h1>
      <p className="max-w-md text-base text-muted-foreground">
        This page doesn&apos;t exist — it may have been moved, or the link might be outdated.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <CtaButton href="/">Back to Home</CtaButton>
        <CtaButton href="/catalogue" variant="outline">
          Browse Catalogue
        </CtaButton>
      </div>
    </div>
  )
}
