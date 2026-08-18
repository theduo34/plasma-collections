import { WhatsappLogoIcon } from "@phosphor-icons/react"

export function StorefrontNav() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-border px-6">
      <span className="font-sans text-sm uppercase tracking-widest text-foreground">
        Plasma Collections
      </span>
      <WhatsappLogoIcon className="text-primary" size={20} />
    </nav>
  )
}
