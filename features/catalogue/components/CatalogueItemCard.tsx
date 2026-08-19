import Image from "next/image"
import Link from "next/link"
import { ImageIcon } from "@phosphor-icons/react/dist/ssr"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ItemStatusBadges } from "@/features/catalogue/components/ItemStatusBadges"
import type { PublicItem } from "@/features/catalogue/types/item"

export function CatalogueItemCard({ item }: { item: PublicItem }) {
  return (
    <Link href={`/item/${item._id}`} className="group flex flex-col gap-2">
      <AspectRatio
        ratio={1}
        className="relative overflow-hidden rounded-lg border border-border bg-muted"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 224px, (min-width: 640px) 33vw, 45vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-muted-foreground/40" size={32} />
          </div>
        )}
        <ItemStatusBadges item={item} />
      </AspectRatio>
      <div className="flex flex-col gap-0.5">
        <p className="truncate text-sm text-foreground">{item.name}</p>
        <p className="font-price text-sm font-medium text-foreground">
          GH₵ {(item.price / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
