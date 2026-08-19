import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CatalogueBrowser } from "@/features/catalogue/components/CatalogueBrowser"

export function CataloguePage() {
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <CatalogueBrowser />
    </Suspense>
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
