'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeftIcon, BasketIcon, ImageIcon } from "@phosphor-icons/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { QuantityStepper } from "@/features/order/components/QuantityStepper"
import { useOrderCart } from "@/features/order/hooks/useOrderCart"
import { usePublicItem } from "@/features/catalogue/hooks/usePublicItem"
import { usePublicCategories } from "@/features/catalogue/hooks/usePublicCategories"
import type { Id } from "@/convex/_generated/dataModel"

export function ItemDetailPage({ itemId }: { itemId: Id<"items"> }) {
  const item = usePublicItem(itemId)
  const categories = usePublicCategories()
  const { addItem } = useOrderCart()
  const [quantity, setQuantity] = useState(1)

  if (item === undefined) {
    return (
      <div className="container-page section-y grid gap-10 sm:grid-cols-2">
        <Skeleton className="aspect-square" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (item === null) {
    return (
      <div className="container-page section-y">
        <EmptyState
          title="Item not found"
          description="This item may have been removed or is no longer available."
        />
      </div>
    )
  }

  const categoryName = categories?.find((category) => category._id === item.categoryId)?.name

  return (
    <div className="container-page section-y">
      <Link
        href="/catalogue"
        aria-label="Back to catalogue"
        className="mb-6 flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-muted"
      >
        <ArrowLeftIcon size={16} />
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-md border border-border bg-muted">
          <AspectRatio ratio={1} className="relative">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="text-muted-foreground/40" size={64} />
              </div>
            )}
            {!item.inStock && (
              <Badge variant="secondary" className="absolute top-3 left-3">
                Sold out
              </Badge>
            )}
          </AspectRatio>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {categoryName && (
              <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                {categoryName}
              </span>
            )}
            <h1 className="font-sans text-3xl font-semibold text-foreground sm:text-4xl">
              {item.name}
            </h1>
            {item.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-md border border-border p-5">
            <p className="font-price text-2xl font-medium text-foreground">
              GH₵ {(item.price / 100).toFixed(2)}
            </p>

            {item.inStock ? (
              <div className="flex items-center gap-3">
                <QuantityStepper quantity={quantity} onChange={setQuantity} />
                <button
                  type="button"
                  onClick={() => {
                    addItem({ itemId: item._id, name: item.name, price: item.price, quantity })
                    toast.success(`Added ${item.name} to cart`)
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <BasketIcon size={20} />
                  Add to Cart
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Currently sold out — check back soon.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
