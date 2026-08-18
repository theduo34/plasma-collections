import type { Icon } from "@phosphor-icons/react"
import { ScissorsIcon, SparkleIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr"

type ValueProp = {
  icon: Icon
  title: string
  description: string
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: SparkleIcon,
    title: "Handpicked Quality",
    description: "Every piece is selected for craftsmanship, not volume.",
  },
  {
    icon: WhatsappLogoIcon,
    title: "Order on WhatsApp",
    description: "No cart, no account — just message us to buy.",
  },
  {
    icon: ScissorsIcon,
    title: "Repairs & Alterations",
    description: "Resoling, hemming, and leather restoration, done right.",
  },
]

export function ValuePropsSection() {
  return (
    <section className="border-t border-border">
      <div className="container-page section-y grid gap-8 sm:grid-cols-3">
        {VALUE_PROPS.map(({ icon: ValuePropIcon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <ValuePropIcon className="text-primary" size={28} />
            <p className="text-base font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
