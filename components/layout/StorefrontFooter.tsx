import Link from "next/link"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export async function StorefrontFooter() {
  const categories = await fetchQuery(api.public.categories.list, {}).catch(() => [])
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Plasma Collections
          </span>
          <p className="text-xs text-muted-foreground">
            Premium Ghanaian fashion — clothes, shoes, and repairs. Orders taken directly on
            WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-foreground">
            Shop
          </span>
          <Link href="/catalogue" className="text-xs text-muted-foreground hover:text-foreground">
            Full catalogue
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/catalogue?category=${category.slug}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-foreground">
            Contact
          </span>
          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Chat on WhatsApp
            </a>
          )}
          <span className="text-xs text-muted-foreground">Accra, Ghana</span>
        </div>
      </div>

      <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Plasma Collections
      </div>
    </footer>
  )
}
