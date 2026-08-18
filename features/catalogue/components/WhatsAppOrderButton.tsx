'use client'
import { WhatsappLogoIcon } from "@phosphor-icons/react"
import { buildWhatsAppMessage, type OrderItem } from "@/features/order/utils/buildWhatsAppMessage"

// Gold button — green is only used on the WhatsApp icon.
export function WhatsAppOrderButton({ items }: { items: OrderItem[] }) {
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER!

  return (
    <button
      className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
      onClick={() => window.open(buildWhatsAppMessage(items, phoneNumber), "_blank")}
    >
      {/* Only intentional exception to "semantic tokens only" */}
      <WhatsappLogoIcon className="text-[#25D366]" size={18} />
      Order on WhatsApp
    </button>
  )
}
