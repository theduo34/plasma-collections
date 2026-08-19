import Image from "next/image"
import Link from "next/link"
import { ImageIcon } from "@phosphor-icons/react/dist/ssr"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import type { PublicItem } from "@/features/catalogue/types/item"

export function ItemCard({ item }: { item: PublicItem }) {
  return (
    <Link href={`/item/${item._id}`} className="group flex flex-col">
      <AspectRatio ratio={1} className="relative bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-muted-foreground/40" size={40} />
          </div>
        )}
        {!item.inStock && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Sold out
          </Badge>
        )}
      </AspectRatio>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <p className="text-base text-foreground">{item.name}</p>
        <p className="font-price text-base font-medium text-foreground">
          GH₵ {(item.price / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
