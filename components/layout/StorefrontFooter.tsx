import Link from "next/link"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export async function StorefrontFooter() {
  const categories = await fetchQuery(api.public.categories.list, {}).catch(() => [])
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER

  return (
    <footer className="dark bg-background">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8">
        <span className="font-sans text-sm font-semibold tracking-[0.2em] text-foreground uppercase">
          Plasma Collections
        </span>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/catalogue?category=${category.slug}`}
              className="hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>

        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Plasma Collections
        </span>
      </div>
    </footer>
  )
}
