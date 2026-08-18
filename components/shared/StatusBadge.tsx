import { cn } from "@/lib/utils"

export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground",
        className
      )}
    >
      {label}
    </span>
  )
}
