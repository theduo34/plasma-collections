'use client'

import { TrashIcon } from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { EmptyState } from "@/components/shared/EmptyState"
import { WhatsAppOrderButton } from "@/features/catalogue/components/WhatsAppOrderButton"
import { QuantityStepper } from "@/features/order/components/QuantityStepper"
import { useOrderCart } from "@/features/order/hooks/useOrderCart"

export function OrderSummarySheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { items, updateQuantity, removeItem } = useOrderCart()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Order</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="px-4">
            <EmptyState
              title="Your cart is empty"
              description="Add items from a product page to build your WhatsApp order."
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
            {items.map((item) => (
              <div key={item.itemId} className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-foreground">{item.name}</p>
                  <p className="font-price text-sm text-muted-foreground">
                    GH₵ {(item.price / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={(quantity) => updateQuantity(item.itemId, quantity)}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.itemId)}
                    className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter>
            <div className="flex items-center justify-between">
              <span className="text-sm tracking-wide text-muted-foreground uppercase">Total</span>
              <span className="font-price text-base font-medium text-foreground">
                GH₵ {(total / 100).toFixed(2)}
              </span>
            </div>
            <WhatsAppOrderButton items={items} className="w-full" />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
