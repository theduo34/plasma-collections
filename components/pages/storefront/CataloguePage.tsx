import { Suspense } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { CatalogueBrowser } from "@/features/catalogue/components/CatalogueBrowser"

export function CataloguePage() {
  return (
    <div className="container-page section-y">
      <PageHeader title="Catalogue" description="Clothes, shoes, and repairs — all in one place." />
      <Suspense fallback={<CatalogueSkeleton />}>
        <CatalogueBrowser />
      </Suspense>
    </div>
  )
}

function CatalogueSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square rounded-lg" />
      ))}
    </div>
  )
}
