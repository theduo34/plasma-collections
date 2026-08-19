'use client'

import { useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { ImageIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function ItemImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  // Stable instance — a fresh Autoplay() on every render breaks its timer.
  const [autoplay] = useState(() => Autoplay({ delay: 4000, stopOnInteraction: false }))

  useEffect(() => {
    if (!api) return
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  if (images.length === 0) {
    return (
      <AspectRatio ratio={1} className="flex items-center justify-center bg-muted">
        <ImageIcon className="text-muted-foreground/40" size={64} />
      </AspectRatio>
    )
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: images.length > 1 }}
      plugins={images.length > 1 ? [autoplay] : []}
    >
      <CarouselContent className="ml-0">
        {images.map((src, index) => (
          <CarouselItem key={src} className="pl-0">
            <AspectRatio ratio={1} className="relative bg-muted">
              <Image
                src={src}
                alt={`${alt} — photo ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority={index === 0}
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-3 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background" />
          <CarouselNext className="right-3 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background" />
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  index === current ? "bg-primary" : "bg-background/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  )
}
