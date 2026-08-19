import type { ReactNode } from "react"

export function CatalogueEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/60">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-sans text-xl font-semibold text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}
