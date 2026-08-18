export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="font-sans text-xl font-semibold uppercase tracking-wide text-foreground">
        {title}
      </h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
