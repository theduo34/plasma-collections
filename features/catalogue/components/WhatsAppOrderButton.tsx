'use client'
import { WhatsappLogoIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { buildWhatsAppMessage, type OrderItem } from "@/features/order/utils/buildWhatsAppMessage"

// Gold button — green is only used on the WhatsApp icon.
export function WhatsAppOrderButton({
  items,
  className,
}: {
  items: OrderItem[]
  className?: string
}) {
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER!

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-base font-medium text-primary-foreground",
        className
      )}
      onClick={() => window.open(buildWhatsAppMessage(items, phoneNumber), "_blank")}
    >
      {/* WhatsApp's own mark, in its own green — a third-party brand icon we never recolor. */}
      <WhatsappLogoIcon className="text-whatsapp" size={20} weight="fill" />
      Order on WhatsApp
    </button>
  )
}
