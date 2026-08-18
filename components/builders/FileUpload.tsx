import { ImageIcon } from "@phosphor-icons/react"

// TODO: wire to ctx.storage.generateUploadUrl
export function FileUpload({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-8 text-muted-foreground">
      <ImageIcon size={24} />
      <span className="text-xs">{label}</span>
    </div>
  )
}
