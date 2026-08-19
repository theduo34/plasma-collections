'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BasketIcon, WhatsappLogoIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useOrderCart } from "@/features/order/hooks/useOrderCart"
import { OrderSummarySheet } from "@/features/order/components/OrderSummarySheet"

// Unscrolled + transparent-dark only applies on "/", where HeroSection's dark
// backdrop (see its -mt-16) sits directly behind the nav. Every other public
// page has a light top section, so the nav stays in its normal light/solid
// treatment there — otherwise the logo and links render light-on-light.
export function StorefrontNav() {
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER
  const pathname = usePathname()
  const { count } = useOrderCart()
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const overDarkHero = pathname === "/" && !scrolled

  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b transition-all duration-300",
        overDarkHero
          ? "dark border-transparent bg-transparent"
          : "border-border bg-background/85 shadow-sm backdrop-blur"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-sans text-base font-semibold uppercase tracking-[0.2em] text-foreground"
        >
          Plasma Collections
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/catalogue"
            className="mr-2 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalogue
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="View cart"
                onClick={() => setCartOpen(true)}
                className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <BasketIcon size={22} />
                {count > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 rounded-full p-0 text-[10px]">
                    {count}
                  </Badge>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>View cart</TooltipContent>
          </Tooltip>

          {phoneNumber && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                >
                  {/* WhatsApp's own mark, in its own green — a third-party brand icon we never recolor. */}
                  <WhatsappLogoIcon className="text-whatsapp" size={22} weight="fill" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Chat on WhatsApp</TooltipContent>
            </Tooltip>
          )}
        </div>
      </nav>

      <OrderSummarySheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  )
}
