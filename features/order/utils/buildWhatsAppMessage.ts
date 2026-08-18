export interface OrderItem {
  name: string
  price: number       // in pesewas
  quantity: number
}

export function buildWhatsAppMessage(items: OrderItem[], phoneNumber: string): string {
  const lines = items.map(
    (item) => `• ${item.name} × ${item.quantity} — GH₵ ${(item.price / 100).toFixed(2)}`
  )
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const message = [
    "Hello! I'd like to order the following from Plasma Collections:",
    "",
    ...lines,
    "",
    `Total: GH₵ ${(total / 100).toFixed(2)}`,
    "",
    "Please confirm availability and payment details. Thank you!",
  ].join("\n")

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encoded}`
}
