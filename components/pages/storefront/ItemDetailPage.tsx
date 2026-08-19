'use client'

import Image from "next/image"
import Link from "next/link"
import { ArrowLeftIcon, ImageIcon } from "@phosphor-icons/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { WhatsAppOrderButton } from "@/features/catalogue/components/WhatsAppOrderButton"
import { usePublicItem } from "@/features/catalogue/hooks/usePublicItem"
import type { Id } from "@/convex/_generated/dataModel"

export function ItemDetailPage({ itemId }: { itemId: Id<"items"> }) {
  const item = usePublicItem(itemId)

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

  return (
    <div className="container-page section-y">
      <Link
        href="/catalogue"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon size={14} />
        Back to catalogue
      </Link>

      <div className="grid gap-10 sm:grid-cols-2">
        <AspectRatio ratio={1} className="relative bg-muted">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
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

        <div className="flex flex-col gap-4">
          <h1 className="font-sans text-2xl font-semibold text-foreground">{item.name}</h1>
          <p className="font-price text-xl font-medium text-foreground">
            GH₵ {(item.price / 100).toFixed(2)}
          </p>
          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}

          {item.inStock ? (
            <WhatsAppOrderButton
              items={[{ name: item.name, price: item.price, quantity: 1 }]}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Currently sold out — check back soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
