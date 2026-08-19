'use client'

import { MinusIcon, PlusIcon } from "@phosphor-icons/react"

export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
}: {
  quantity: number
  onChange: (quantity: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="flex size-9 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <MinusIcon size={14} />
      </button>
      <span className="w-4 text-center text-sm font-medium text-foreground">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="flex size-9 items-center justify-center text-foreground transition-colors hover:bg-muted"
      >
        <PlusIcon size={14} />
      </button>
    </div>
  )
}
