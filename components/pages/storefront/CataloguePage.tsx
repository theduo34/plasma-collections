import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CatalogueBrowser } from "@/features/catalogue/components/CatalogueBrowser"

export function CataloguePage() {
  return (
    <>
      {/* No visible page title by design (search bar replaces it) — kept
          for SEO/accessibility so the page still has exactly one h1. */}
      <h1 className="sr-only">Catalogue</h1>
      <Suspense fallback={<CatalogueSkeleton />}>
        <CatalogueBrowser />
      </Suspense>
    </>
  )
}

function CatalogueSkeleton() {
  return (
    <div className="container-page pt-24 pb-14">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  )
}
