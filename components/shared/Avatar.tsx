import { cn } from "@/lib/utils"

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground",
        className
      )}
    >
      {initials}
    </span>
  )
}
