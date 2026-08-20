# CLAUDE.md — the-drop
Plasma Collections · Storefront & Admin Console · AI Agent Specification

This file is the single source of truth for Claude Code when working in this repository. Read every section before writing any code, creating any file, or making any decision.

Adapted from the SysAid project structure (a university IT help desk built on Next.js + Convex). Every structural, styling, and tooling convention below is carried over unchanged. What changed: the domain (fashion retail), the public surface (a customer-facing storefront), and the role model (public / admin / super-admin — no self-registration).

---

## Commands

```bash
bun dev                  # start Next.js dev server at localhost:3000
bun build                # production build
bun lint                 # run ESLint

bunx convex dev          # start Convex dev deployment, watches convex/ and regenerates types
bunx convex deploy       # push functions + schema to production deployment
bunx convex run <fn>     # invoke a Convex function once from the CLI (used to bootstrap the first super-admin)
bun shadcn:add           # add a shadcn component: bun shadcn:add <component>
```

There is no `supabase:generate-types` step — Convex generates `convex/_generated/api.d.ts` and `convex/_generated/dataModel.d.ts` automatically whenever `convex dev` is running. Never edit anything under `convex/_generated/`.

---

## Project Overview

**the-drop** is the digital storefront for **Plasma Collections**, a premium Ghanaian fashion brand selling clothes, shoes, and offering repair services. The public surface lets anyone browse available items — no account, no friction — and place an order by tapping a WhatsApp button that opens a pre-filled message to the store owner.

The admin console (protected, no self-registration) lets the store owner (admin) manage the catalogue: add items, update prices, toggle stock availability, and upload product images. The super-admin (the developer) manages admin accounts, configures system settings, and has full access to everything.

There is no checkout flow, no cart persistence, and no payment integration in the MVP. WhatsApp is the order channel. Payment integration (Paystack) is a planned future enhancement — the data model is designed to support it without restructuring.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 · App Router · React 19 · TypeScript (strict) |
| Styling | Tailwind CSS v4 · shadcn/ui (radix-lyra style) |
| Backend / DB | Convex (reactive database + serverless functions) |
| Auth | Convex Auth (`@convex-dev/auth`), Password provider — no signup flow in the UI |
| File storage | Convex file storage (`ctx.storage`) — product images |
| Realtime | Convex queries are reactive by default — stock/price updates reflect instantly on the storefront |
| Forms | React Hook Form + Zod |
| Icons | `@phosphor-icons/react` |
| Fonts | Geist Sans · Geist Mono · JetBrains Mono (body defaults to monospace) |
| Toasts | sonner |

Path alias: `@/` maps to the project root. Always use `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/convex/...`, etc.

**The single biggest mental shift:** Convex has no Row Level Security. There is no database-level policy layer. Every Convex query and mutation is the security boundary — if a function doesn't check the caller's identity and role itself, nothing does.

---

## Brand & Design Tokens

Plasma Collections' visual identity is **black and gold** — dark luxury, not streetwear. The storefront must feel like a premium boutique, not a generic Ghanaian shop page.

The app supports real light and dark themes (`:root` = light default, `.dark` = dark, standard shadcn convention) — it does not force dark globally. The gold accent (`--pc-gold`) stays constant as `--primary`/`--ring` in both; only the neutrals (background/foreground/card/border) swap. Light mode must never render a black background — that was a bug in an earlier version of this file where `:root` duplicated the dark values.

**Gold is for emphasis, not decoration.** `--primary` (and `text-primary`/`bg-primary`) is reserved for the one or two things per screen that genuinely need attention — the main call-to-action button, a focus ring, an active/selected state. It is not a default text color, not an icon color, not something applied because a piece of text is "on brand." Most of the page is neutral (`--foreground`, `--muted-foreground`) so that gold actually stands out when it appears. `--muted-foreground` is a true neutral gray, not a gold tint — an earlier version of this file wired it to `--pc-gold-muted`, which colored nearly every description, caption, and secondary link on the site gold; that was a bug, not a design choice.

```css
/* app/globals.css — seed these under @theme inline { ... } */
--pc-black: #0A0A0A;         /* dark-mode background */
--pc-gold: #C9A227;          /* primary accent — buttons, highlights, borders */
--pc-gold-light: #E8C84A;    /* hover states */
--pc-gold-muted: #8B6F1E;    /* reserved for a deliberate sparing gold accent — NOT muted-foreground */
--pc-surface: #111111;       /* card / panel background */
--pc-border: #1F1F1F;        /* subtle borders */
--pc-white: #F5F5F0;         /* body text on dark backgrounds */
--whatsapp: #25D366;         /* WhatsApp's own brand green — third-party mark, never recolored to gold */
```

**Typography:**
- Display / headings: Geist Sans, tracked wide, uppercase for section labels
- Body: Geist Mono (brand's monospace-first feel)
- Price / data: JetBrains Mono

**Signature element:** The WhatsApp order button surface is gold, not WhatsApp green — that's our own chrome, matches the brand. The WhatsApp logo icon itself is a third-party mark: never recolor it gold, always render it in WhatsApp's own green via the `--whatsapp` token (`text-whatsapp`), same as their real icon.

**Tailwind v4 rules apply in full** — no `tailwind.config.js`, semantic color tokens only, `gap-*` not `space-*`, `size-*` for square elements, no manual `dark:` overrides.

---

## Tailwind CSS v4 Rules

- No `tailwind.config.js`. All CSS variables and theme tokens live in `app/globals.css` under `@theme inline { ... }`. Never create a separate config file.
- Semantic color tokens only: `bg-primary`, `text-secondary`, `text-muted-foreground`, `bg-destructive`, `border-border`. Never raw classes like `text-yellow-400` or `bg-black`.
- Use `gap-*` for spacing between flex/grid children. Never `space-x-*` or `space-y-*`.
- Use `size-*` when width and height are equal (`size-10` not `w-10 h-10`).
- No manual `dark:` color overrides — semantic tokens handle this automatically.
- Repeated layout spacing (page container width/padding, section vertical rhythm) is defined once in `app/globals.css` via `@utility` and used as a className — `container-page` (max-width + horizontal padding) and `section-y` (vertical section padding). Add new shared spacing patterns the same way instead of repeating raw `mx-auto max-w-* px-* py-*` across files.

---

## shadcn/ui Rules

- shadcn components are installed as source into `components/ui/`. Base style is `radix-lyra`, using `radix-ui` primitives.
- `Slot` import comes from `radix-ui`, not `@radix-ui/react-slot`.
- Use `cn()` from `@/lib/utils` for all conditional class merging.
- `className` is for layout only — never use it to override component colors or typography.
- Icons inside `Button` use the `data-icon` attribute: `data-icon="inline-start"` or `data-icon="inline-end"`.
- Forms use `FieldGroup` + `Field` wrappers, not raw `div` with `space-y-*`.
- `Dialog`, `Sheet`, and `Drawer` always need a `Title` component (use `className="sr-only"` if visually hidden).
- Never add manual `z-index` to overlay components.
- Toast notifications use sonner: `import toast from 'sonner'`. Never build custom toast markup.

---

## Icons

Use `@phosphor-icons/react` exclusively. Never use `lucide-react` or any other icon library. Icon names end in `Icon`: `ShoppingBagIcon`, `WhatsappLogoIcon`, `PencilSimpleIcon`, `TrashIcon`, `ImageIcon`.

The default entrypoint's icons use React Context internally and crash with `createContext only works in Client Components` if rendered from a file without `'use client'`. Import from `@phosphor-icons/react/dist/ssr` in any Server Component; only use the default `@phosphor-icons/react` entrypoint inside files that already have `'use client'` at the top.

```tsx
// Server Component (no 'use client')
import { ShoppingBagIcon, WhatsappLogoIcon } from '@phosphor-icons/react/dist/ssr'

// Client Component ('use client' at top of file)
import { ShoppingBagIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
```

---

## User Roles

Three surfaces. No profiles table with a self-serve role — Convex Auth's users table carries a `role` field set only by an authenticated super-admin, never by the user themselves.

| Role | Auth required | Key capabilities |
|---|---|---|
| public | No | Browse the storefront, view items by category, open WhatsApp order flow. No account, nothing persisted. |
| admin | Yes | Manage the product catalogue — add/edit/delete items, upload images, update prices, toggle stock visibility. |
| super-admin | Yes | Everything admin can do, plus create/deactivate admin accounts, change roles, view audit logs, configure system settings. |

### Registration & Role Assignment Rules

- There is **no `/register` route**. There is no signup flow anywhere in the UI. Do not build it, gate it, or 404 it — it simply does not exist.
- **admin** accounts are created by a super-admin, in-app, via `/admin/[token]/users`, calling `users.createAdmin`. The mutation re-checks the caller is super-admin before inserting.
- **super-admin** accounts are created by another super-admin through the same form.
- **Bootstrapping the first super-admin** is a one-time, out-of-band step:

```bash
bunx convex run users:createSuperAdmin '{"email":"you@email.com","name":"Your Name","password":"..."}'
```

`users:createSuperAdmin` must be an `internalAction` — not reachable from client code at all — and must refuse to run a second time once any super-admin already exists. It's an action, not a mutation: `createAccount()` from `@convex-dev/auth/server` needs an action ctx to hash the password and write the `users`/`authAccounts` rows.

### Why public has no account

The storefront exists to be browsed, not signed into. A visitor selects what they want and taps WhatsApp — no account creation, no session, no cart to persist. Resist adding visitor auth later without a concrete reason.

---

## Folder Structure

```
the-drop/
├── app/
│   ├── (public)/                         # No auth. Anyone can load these.
│   │   ├── page.tsx                      # Storefront home — hero + featured items
│   │   ├── catalogue/
│   │   │   └── page.tsx                  # Full catalogue, filterable by category
│   │   └── item/
│   │       └── [id]/
│   │           └── page.tsx              # Item detail page
│   │
│   ├── (auth)/                           # Login only — no register
│   │   └── [adminToken]/                 # Secret segment, checked against ADMIN_LOGIN_TOKEN
│   │       └── login/
│   │           └── page.tsx              # 404s unless adminToken matches env
│   │
│   ├── (admin)/                          # Authenticated — shared sidebar layout
│   │   ├── layout.tsx                    # Auth guard (any admin/super-admin) + sidebar + topbar
│   │   └── admin/
│   │       └── [token]/                  # Per-login secret — see "Admin Session Tokens" below
│   │           ├── layout.tsx            # Validates [token] against convex/sessionTokens.ts
│   │           ├── dashboard/
│   │           │   └── page.tsx
│   │           ├── catalogue/
│   │           │   ├── page.tsx          # Item list with edit/delete actions
│   │           │   ├── new/
│   │           │   │   └── page.tsx      # Add new item form
│   │           │   └── [id]/
│   │           │       └── page.tsx      # Edit item form
│   │           ├── users/                # super-admin only
│   │           │   ├── layout.tsx        # Redirects non-super-admins to the dashboard
│   │           │   └── page.tsx
│   │           └── settings/             # super-admin only
│   │               ├── layout.tsx        # Redirects non-super-admins to the dashboard
│   │               └── page.tsx
│   │
│   ├── api/
│   │   └── webhooks/                     # Future: Paystack webhooks
│   │       └── paystack/
│   │           └── route.ts
│   │
│   └── globals.css                       # Tailwind v4 theme tokens + brand tokens
│
├── convex/
│   ├── schema.ts                         # Source of truth for the data model
│   ├── auth.ts                           # Convex Auth config (Password provider, no signup)
│   ├── auth.config.ts
│   ├── users.ts                          # createAdmin, createSuperAdmin, listUsers, deactivate
│   ├── sessionTokens.ts                  # Issues/validates/revokes the /admin/[token] URL secret
│   ├── items.ts                          # CRUD for catalogue items
│   ├── categories.ts                     # Category management
│   ├── seed.ts                           # Dev-only fixture data — refuses to run on a non-empty catalogue
│   ├── seedImages.ts                     # Dev-only placeholder photos via ctx.storage — see below
│   ├── public/
│   │   ├── items.ts                      # Public-readable queries — no requireRole()
│   │   └── categories.ts                 # Public-readable queries — no requireRole()
│   ├── lib/
│   │   └── auth.ts                       # requireRole(ctx, roles) — Convex-side RBAC gate
│   └── _generated/                       # Auto-generated — never edit
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                   # Persistent on lg+ (collapsible to an icon rail), Sheet on mobile
│   │   ├── Topbar.tsx                    # Mobile nav toggle, desktop collapse toggle, section label, notification bell
│   │   ├── admin-nav-items.ts            # Nav config shared by Sidebar + Topbar (label, icon, permission)
│   │   ├── StorefrontNav.tsx             # Public navbar with logo + WhatsApp CTA
│   │   ├── StorefrontFooter.tsx
│   │   ├── AuthLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── shared/
│   │   ├── StatusBadge.tsx
│   │   ├── Avatar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── DataTable.tsx
│   ├── builders/
│   │   ├── FormField.tsx
│   │   ├── SelectField.tsx
│   │   ├── TextareaField.tsx
│   │   └── FileUpload.tsx
│   ├── pages/
│   │   ├── storefront/
│   │   │   ├── StorefrontHomePage.tsx    # thin composition — fetches, then assembles the sections below
│   │   │   ├── HeroSection.tsx           # full-bleed dark hero — see the `dark` section-scoping rule below
│   │   │   ├── StatementSection.tsx
│   │   │   ├── CategoryHighlights.tsx
│   │   │   ├── FeaturedSection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── CtaButton.tsx             # storefront marketing CTA — not components/ui/button.tsx, see below
│   │   │   ├── CataloguePage.tsx
│   │   │   └── ItemDetailPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── catalogue/
│   │   │   ├── AdminCataloguePage.tsx
│   │   │   ├── AddItemPage.tsx
│   │   │   └── EditItemPage.tsx
│   │   └── admin/
│   │       ├── AdminUsersPage.tsx
│   │       └── AdminSettingsPage.tsx
│   └── ui/                               # shadcn/ui — never edit manually
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx             # No RegisterForm — it doesn't exist
│   │   │   └── AccountMenu.tsx           # Sidebar-bottom popover: profile, Settings (super-admin), sign out
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePermission.ts
│   │   ├── guards/
│   │   │   └── RoleGuard.tsx
│   │   └── utils/
│   │       └── adminSessionCache.ts      # Tracks the session token in localStorage — never an auth check
│   ├── catalogue/
│   │   ├── components/
│   │   │   ├── ItemCard.tsx              # Product card used on storefront
│   │   │   ├── ItemGrid.tsx              # Grid layout for ItemCard list
│   │   │   ├── CategoryFilter.tsx        # Filter tabs: All / Clothes / Shoes / Repairs
│   │   │   ├── CatalogueBrowser.tsx      # /catalogue page body — filter state lives in the URL (?category=slug)
│   │   │   ├── WhatsAppOrderButton.tsx   # The core CTA — opens pre-filled WA message
│   │   │   ├── ItemForm.tsx              # Add/edit item form (admin)
│   │   │   └── AdminItemTable.tsx        # Table view for admin catalogue management
│   │   ├── hooks/
│   │   │   ├── useItems.ts
│   │   │   ├── usePublicItems.ts
│   │   │   ├── usePublicCategories.ts
│   │   │   └── useItemMutations.ts
│   │   └── types/
│   │       └── item.ts
│   ├── order/
│   │   ├── components/
│   │   │   └── OrderSummarySheet.tsx     # Slide-up showing selected items before WA redirect
│   │   ├── hooks/
│   │   │   └── useOrderCart.ts           # In-memory selection state (no persistence needed for MVP)
│   │   └── utils/
│   │       └── buildWhatsAppMessage.ts   # Constructs the pre-filled WA URL + message
│   ├── admin/
│   │   ├── components/
│   │   │   ├── UserTable.tsx
│   │   │   ├── CreateAdminForm.tsx
│   │   │   └── AuditLogTable.tsx
│   │   └── hooks/
│   │       └── useAdminUsers.ts
│   └── dashboard/
│       ├── components/
│       │   ├── StatsCard.tsx             # Total items, items in stock, categories
│       │   └── RecentActivity.tsx
│       └── hooks/
│           └── useDashboardStats.ts
│
├── hooks/                                # Global/shared hooks
├── providers/
│   └── ConvexClientProvider.tsx
├── lib/
│   ├── utils.ts                          # cn() and shared utilities
│   ├── permissions.ts                    # RBAC — roles, permissions, can()
│   ├── admin-login-path.ts               # resolves /<ADMIN_LOGIN_TOKEN>/login — server-only
│   └── local-storage.ts                  # localStorageHelper — AES-GCM–encrypted localStorage, see below
├── types/
└── proxy.ts                              # Next.js 16 — do not rename to middleware.ts
```

---

## Convex Data Model (`convex/schema.ts`)

```ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,

  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("super-admin")),
    createdBy: v.optional(v.id("users")),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  categories: defineTable({
    name: v.string(),                          // e.g. "Clothes", "Shoes", "Repairs"
    slug: v.string(),                          // e.g. "clothes", "shoes", "repairs"
    order: v.number(),                         // display order
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_slug", ["slug"]),

  items: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),                         // in GHS pesewas (multiply by 100) — future-proofs Paystack
    categoryId: v.id("categories"),
    imageStorageId: v.optional(v.id("_storage")),
    inStock: v.boolean(),
    isVisible: v.boolean(),                    // admin can hide without deleting
    createdBy: v.id("users"),
    updatedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_visible", ["isVisible"])
    .index("by_stock", ["inStock"])
    // Storefront category pages filter by both fields — a compound index
    // avoids reading every item in a category just to discard hidden ones.
    .index("by_category_and_visibility", ["categoryId", "isVisible"]),

  auditLog: defineTable({
    action: v.string(),                        // e.g. "item.create", "item.delete", "user.deactivate"
    performedBy: v.id("users"),
    targetId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_performer", ["performedBy"]),

  // The /admin/<token>/... URL secret — see "Admin Session Tokens" below.
  sessionTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    lastActiveAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"]),
})
```

**Price is stored in pesewas (smallest GHS unit)** — divide by 100 to display. This mirrors how Paystack expects amounts and avoids floating-point issues when payment integration arrives.

---

## WhatsApp Order Flow

This is the core customer interaction. Get it right.

```ts
// features/order/utils/buildWhatsAppMessage.ts

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
```

**Rules for `WhatsAppOrderButton`:**
- Button is gold (`bg-primary`), never WhatsApp green.
- A subtle green `WhatsappLogoIcon` sits inside the button — the only green on the page.
- On tap: if single item, redirect immediately. If multi-item flow, open `OrderSummarySheet` first.
- The WA phone number lives in an environment variable: `NEXT_PUBLIC_WA_NUMBER`.
- When payment integration lands, this button stays — it becomes an alternative to checkout, not replaced by it.

---

## Convex Auth & Authorization

Convex has no RLS backstop. A query or mutation function is the entire security boundary. Every protected function starts with `requireRole()` — no exceptions.

```ts
// convex/lib/auth.ts
import { QueryCtx, MutationCtx } from "../_generated/server"
import type { Role } from "@/lib/permissions"

export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  allowedRoles: Role[]
) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Unauthorized")

  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .unique()

  if (!user || !user.isActive || !allowedRoles.includes(user.role as Role)) {
    throw new Error("Forbidden")
  }

  return user
}
```

Public storefront queries live in `convex/public/` and deliberately omit `requireRole()`. This omission must be obvious and intentional, never accidental.

---

## RBAC — `lib/permissions.ts`

```ts
export type Role = 'admin' | 'super-admin'

export type Permission =
  | 'catalogue:create'
  | 'catalogue:read'
  | 'catalogue:update'
  | 'catalogue:delete'
  | 'catalogue:toggle-visibility'
  | 'users:manage'
  | 'settings:configure'
  | 'audit-log:view'

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'catalogue:create',
    'catalogue:read',
    'catalogue:update',
    'catalogue:delete',
    'catalogue:toggle-visibility',
  ],
  'super-admin': [
    'catalogue:create',
    'catalogue:read',
    'catalogue:update',
    'catalogue:delete',
    'catalogue:toggle-visibility',
    'users:manage',
    'settings:configure',
    'audit-log:view',
  ],
}

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}
```

`lib/permissions.ts` is the only place permissions are defined. Never hardcode `role === 'admin'` outside this file. Always use `can()`.

---

## Client Setup

```tsx
// providers/ConvexClientProvider.tsx
'use client'
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"
import { ConvexReactClient } from "convex/react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexAuthNextjsProvider client={convex}>{children}</ConvexAuthNextjsProvider>
}
```

---

## proxy.ts — Route Protection

Next.js 16 renamed `middleware.ts` to `proxy.ts`. Do not rename it back.

The login page is not at `/login`. It lives at `/<ADMIN_LOGIN_TOKEN>/login`, a path built from a UUID set in `.env.local` (see `lib/admin-login-path.ts`). Unauthenticated visitors to protected routes are redirected to `/`, never to the login path itself — a redirect to it would advertise the secret URL to anyone who tries `/admin`.

```ts
// proxy.ts
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { getAdminLoginPath } from "@/lib/admin-login-path"

// All admin routes live at /admin/<token>/... — see "Admin Session Tokens" below.
const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isLoginRoute = createRouteMatcher([getAdminLoginPath()])

export default convexAuthNextjsMiddleware(async (request) => {
  if (isAdminRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/")
  }
  if (isLoginRoute(request) && (await isAuthenticatedNextjs())) {
    const token = await fetchQuery(
      api.sessionTokens.current,
      {},
      { token: await convexAuthNextjsToken() }
    ).catch(() => null)
    return nextjsMiddlewareRedirect(request, token ? `/admin/${token}/dashboard` : "/")
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

`proxy.ts` only gates "is this visitor logged in at all." The `[token]` segment itself is validated one layer deeper, in `app/(admin)/admin/[token]/layout.tsx` — see below.

---

## Admin Session Tokens — the `/admin/<token>/...` URL scheme

Every admin/super-admin route lives under a per-login secret path segment, not a fixed one: `/admin/<token>/dashboard`, `/admin/<token>/catalogue`, etc. This is a second, independent secret on top of the Convex Auth session cookie — the same "don't put the real thing at a guessable path" idea as `/<ADMIN_LOGIN_TOKEN>/login`, applied to every page behind it instead of just the login form.

Rules, enforced in `convex/sessionTokens.ts` (the real boundary — see "No Row Level Security" below) and re-checked in `app/(admin)/admin/[token]/layout.tsx` (defense in depth):

- **Issued at login, never reused.** `LoginForm` calls `sessionTokens.issue` right after `signIn()` succeeds, which deletes any token the user already held and mints a new `crypto.randomUUID()`. Logging in always produces a brand-new URL — an old tab, an old bookmark, a link pasted somewhere it shouldn't have been, all stop working the moment a new login happens.
- **One live token per user.** `issue` deletes the previous row for that `userId` before inserting — a user can't have two valid admin URLs at once.
- **24-hour sliding idle window.** Each token row carries `lastActiveAt`. Every visit to an `/admin/[token]/...` route calls `sessionTokens.touch`, which checks `Date.now() - lastActiveAt <= 24h` and, if still valid, bumps `lastActiveAt` forward. Keep visiting at least once a day and the URL stays alive; go quiet for 24 hours and the next visit finds it expired (and deletes the row).
- **Revoked immediately on sign-out.** `AccountMenu` (the popover at the bottom of `Sidebar`) calls `sessionTokens.revoke` before `signOut()` — closing the session kills the URL right away instead of waiting out the idle window.
- **Invalid token → redirect home, same as unauthenticated.** A mismatched, expired, or someone-else's token never gets a distinguishing error — it's treated exactly like "not logged in" (redirect to `/`), so a probe can't tell a stale token from a wrong one.

Don't hardcode an `/admin/...` path anywhere in the UI — every internal admin link has to include the current token, read via `useParams<{ token: string }>()` in a client component under the `[token]` segment (or `params` in a Server Component).

---

## Client-Side Local Storage — `lib/local-storage.ts`

`localStorageHelper` (`set`, `get`, `has`, `remove`, `removeAll`) is an AES-GCM–encrypted wrapper around `window.localStorage`, keyed from `NEXT_PUBLIC_LOCAL_STORAGE_SALT` (PBKDF2-derived). All values live under a `pc:` prefix so `removeAll()` only ever clears what this helper wrote — it never touches unrelated storage like the storefront cart (`features/order/components/OrderCartProvider.tsx`, which is plain, unencrypted `localStorage` and should stay that way — cart contents aren't sensitive, and rewriting a working feature onto an async encrypted store isn't worth the risk).

**What this does and doesn't buy you:**
- It IS real AES-GCM encryption — a tampered or wrong-key payload fails to decrypt (`get` returns `null` and drops the corrupt entry) rather than silently returning garbage.
- The key necessarily ships in the browser bundle — anything that decrypts client-side needs its key client-side, there's no way around that on the web. So this stops a casual look at devtools → Application → Local Storage, or a script grepping localStorage for recognizable plaintext. It does **not** stop a determined attacker who reads the site's own JavaScript.
- **Never use a value read back from here to make an access-control or redirect decision.** The one current consumer, `features/auth/utils/adminSessionCache.ts`, tracks the admin's session token client-side purely for visibility — it is not read anywhere to decide "is this user logged in." That decision is made server-side, on every request, by `proxy.ts` (checks the real Convex Auth session) and `convex/sessionTokens.ts`'s `current()`/`touch()` (re-check the database row). A forged or stale cache entry can't bypass that — at worst it points at a URL that `app/(admin)/admin/[token]/layout.tsx` immediately rejects and bounces home, identical to having no session at all. If you're tempted to read `adminSessionCache` to skip the login form or gate a route, don't — that logic already exists, server-side, and is the actual security boundary.

---

## Import Convention & Data Flow

```
features/[feature]/components/
        ↓
components/pages/[page]/PageName.tsx      ← assembles features into a full view
        ↓
app/(public|auth|admin)/[route]/page.tsx  ← metadata only, imports the page component
```

- `app/**/page.tsx` is **metadata only**. Export `metadata` and a default function returning the page component. Zero logic, zero JSX beyond the import.
- `components/pages/` assembles features. Can import from multiple features and from `components/shared/` or `components/builders/`.
- `features/` are self-contained. A feature must not import from another feature's components.

---

## Coding Conventions

- TypeScript strict. No `any`. All types in `features/[feature]/types/`.
- Server Components by default. Add `'use client'` only for browser APIs, event handlers, or Convex hooks.
- Server Components fetch using `fetchQuery`/`preloadQuery` from `convex/nextjs`. Never `useEffect` for initial data.
- Client components use `useQuery`/`useMutation` from `convex/react`, wrapped in a feature hook — never called inline in page components.
- Comments: `//` in `.ts`/`.tsx`, `{/* */}` in JSX only. No block comments. No unnecessary comments — only write one when the WHY is non-obvious.
- Zod for all form validation, co-located with form components. Convex's `v.*` validators guard the function boundary; Zod guards the form boundary — both exist.
- Convex functions return data or throw. No `{ data, error }` envelope — `useQuery`/`useMutation` already expose `isPending`/`error`. Surface errors with `toast.error()` from sonner.
- Loading states always. `useQuery` returns `undefined` while loading — treat as loading state, use skeleton components.
- Semantic colors only. Never raw values like `text-yellow-400` or `bg-black`.
- Keep components under ~150 lines. Split if larger.

---

## Environment Variables

```bash
NEXT_PUBLIC_CONVEX_URL=           # from `bunx convex dev`
CONVEX_DEPLOYMENT=                # dev:xxx or prod:xxx — set automatically by the CLI
AUTH_SECRET=                      # Convex Auth session signing secret — server-only
ADMIN_LOGIN_TOKEN=                # UUID; login page lives at /<this>/login — server-only, never NEXT_PUBLIC_
NEXT_PUBLIC_WA_NUMBER=            # WhatsApp business number with country code, no + (e.g. 233XXXXXXXXX)
NEXT_PUBLIC_APP_URL=              # e.g. http://localhost:3000
NEXT_PUBLIC_LOCAL_STORAGE_SALT=   # localStorageHelper's AES-GCM passphrase — see "Client-Side Local Storage" below
RESEND_API_KEY=                   # only if transactional email is added later
```

---

## Pages & Access Control

| Route | Roles | Purpose |
|---|---|---|
| `/` | Public | Storefront home — hero, featured items, category highlights |
| `/catalogue` | Public | Full item catalogue with category filter |
| `/item/[id]` | Public | Item detail — images, description, price, order button |
| `/[adminToken]/login` | Public (secret) | Email/password login — path segment must match `ADMIN_LOGIN_TOKEN`, else 404. No register link, no register route. |
| `/admin/[token]/dashboard` | admin, super-admin | Overview stats — total items, stock levels |
| `/admin/[token]/catalogue` | admin, super-admin | Manage items — add, edit, delete, toggle visibility |
| `/admin/[token]/catalogue/new` | admin, super-admin | Add new item form |
| `/admin/[token]/catalogue/[id]` | admin, super-admin | Edit item form |
| `/admin/[token]/users` | super-admin only | Create/deactivate admin accounts, change roles |
| `/admin/[token]/settings` | super-admin only | System config (WA number, store name, etc.) |

`[token]` is the per-login secret described in "Admin Session Tokens" above — not a fixed segment name.

---

## Out of Scope (MVP)

Do not build. Document as future enhancements.

- Self-service registration or invite links
- Cart persistence (localStorage or server-side)
- Payment integration (Paystack — planned, data model is ready)
- Order tracking or order history
- Customer accounts / wishlists
- SMS notifications
- Product reviews or ratings
- Discount codes or promotions
- Instagram or other social platform DM automation
- Mobile app

---

## Agent Decision Rules

When in doubt, apply these in order:

1. Read this file before creating any file or route.
2. `app/**/page.tsx` → metadata only. No logic. No JSX beyond the page import.
3. `components/pages/` → group by domain, not one folder per page.
4. `features/[feature]/components/` → all feature-specific UI and logic.
5. `components/shared/` → truly reusable, zero feature knowledge.
6. `components/ui/` → shadcn only, never edit manually. Use `bun shadcn:add`.
7. `convex/_generated/` → auto-generated. Never edit manually.
8. `lib/permissions.ts` → only place permissions are defined. Never hardcode role strings elsewhere.
9. No raw color classes, ever — not even for one-off brand marks like WhatsApp. Every color used in a className must be a token defined in `app/globals.css` (`text-primary`, `text-destructive`, `text-whatsapp`, etc.). If a new color is genuinely needed, add it as a token there first, then reference it — never `text-[#hex]`.
10. No `lucide-react`. Only `@phosphor-icons/react` — from `/dist/ssr` in Server Components, the default entrypoint only inside `'use client'` files.
11. No Row Level Security exists. `requireRole()` in every Convex function is the actual security layer.
12. `requireRole()` first in every Convex query/mutation that touches non-public data.
13. Public storefront queries live in `convex/public/` — the missing `requireRole()` there is intentional and obvious.
14. No self-registration, ever. No `/register` route. Admins are created by super-admins; first super-admin via `convex run`.
15. Price is always stored in pesewas. Always divide by 100 for display. Never store decimal GHS.
16. `WhatsAppOrderButton` is gold, not green. The WA number comes from `NEXT_PUBLIC_WA_NUMBER`.
17. Keep components under ~150 lines. Split if larger.
18. `proxy.ts` at project root — do not rename or move, and do not call it `middleware.ts`.
19. The login page is never at literal `/login`. It's at `/<ADMIN_LOGIN_TOKEN>/login` (see `lib/admin-login-path.ts`), and unauthenticated redirects from protected routes go to `/`, never to the login path — never hardcode `/login` or redirect to the login path from a public-facing check.
20. Repeated page-layout spacing goes in `app/globals.css` as an `@utility` (`container-page`, `section-y`), not copy-pasted `mx-auto max-w-* px-* py-*` per file.
21. Third-party brand marks (WhatsApp's logo, any future payment/social logo) keep their own real color and full-size icon — never recolored to gold, never shrunk to a token "dot". Our own chrome (button surfaces, backgrounds) can still be gold; the mark itself can't.
22. `components/pages/storefront/CtaButton.tsx` is not a duplicate of `components/ui/button.tsx` — it's the deliberately larger marketing CTA for storefront pages (hero, banners), where `components/ui/button.tsx` stays the compact control used in the admin console. Don't collapse them into one; don't hand-roll a third variant either — extend `CtaButton` if a new storefront CTA style is needed.
23. Any list of ≥3 visually-identical items rendered from static (non-fetched) data is a typed, named, module-level array mapped over — never 3+ copy-pasted JSX blocks, never an anonymous array literal inline in the JSX.
24. Import `fetchQuery`/`fetchMutation`/`preloadQuery` directly from `convex/nextjs` at the call site. There is no `lib/convex/` wrapper — one existed, was never imported anywhere, and its `client.ts` half instantiated a second, unauthenticated `ConvexReactClient` completely separate from `providers/ConvexClientProvider.tsx`. Don't recreate it.
25. Icons: never a hand-typed character standing in for one (no `→`, `✓`, emoji, etc. as a substitute icon) — every icon comes from `@phosphor-icons/react`. Generic icons (arrows, category glyphs, spinners) get no color override — they inherit the surrounding text color, i.e. no `className="text-primary"` decoration. Only a real third-party brand mark (WhatsApp) gets an explicit color, and only its own real brand color (`text-whatsapp`), never ours.
26. Border radius is `rounded-md` everywhere a card, button, badge, or bordered panel needs rounding — this is a `rounded-none`-by-default (`radix-lyra`) shadcn style, so every `components/ui/*.tsx` file and every hand-written bordered surface has been overridden to `rounded-md` for one consistent radius language project-wide. The one deliberate exception is a circular avatar (`components/shared/Avatar.tsx`) — a profile picture is conventionally a circle, not a rounded square.
27. When a role is a strict superset of another (super-admin ⊇ admin in `lib/permissions.ts`), express it structurally — spread the smaller role's permission list into the bigger one's — never re-list the same permissions by hand in both places.
28. To flip a section to the black/gold "dark luxury" palette (the homepage hero, the closing CTA+footer), add `className="dark"` to that section and keep using the normal semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`) inside it — the `.dark` CSS scope remaps those tokens to `--pc-black`/`--pc-white`/etc. automatically. Never hardcode a dark-section color directly; if a section needs to look dark, scope it, don't recolor it.
29. The homepage structure (Option B, approved over an "editorial split" alternative) is: full-bleed dark `HeroSection` (`-mt-16` under the nav) → `StatementSection` (one big line, no card, no icons) → `CategoryHighlights` (edge-to-edge, no gaps, no borders, name overlaid on the block) → `FeaturedSection` (borderless product tiles) → `CtaSection` + `StorefrontFooter` (share the same `dark` scope, no seam between them, deliberately one continuous closing block). Don't reintroduce bordered/boxed sections or reflow this into a symmetric "stack of equal cards" — that's the pattern this replaced.
30. Item/category photos go through `ctx.storage` exactly the same way whether they're a real admin upload or a dev placeholder — `convex/seedImages.ts` fills in anything missing an `imageStorageId` via a placeholder image service and `ctx.storage.store()`, the real storage pipeline, not a throwaway hack. Public queries resolve `imageStorageId` to a servable URL themselves (see `PublicItem`/`PublicCategory` in `features/catalogue/types/item.ts`) — components never call `ctx.storage.getUrl` or construct a storage URL themselves. Once every item/category has a real uploaded photo, `seedPlaceholderImages` simply finds nothing left to do — no cleanup step needed.
31. Every admin route is nested under `/admin/[token]/...` — never add an admin page at a fixed path like `/dashboard` or `/admin/settings` directly. The `[token]` is the per-login secret from `convex/sessionTokens.ts` (see "Admin Session Tokens" above); a new admin route goes under `app/(admin)/admin/[token]/`, and any link to it is built from the current token via `useParams()`/`params`, never hardcoded.
32. `Sidebar`/nav-rail surfaces use the `--sidebar-*` token family (`bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary` + `text-sidebar-primary-foreground` for the active nav item, `bg-sidebar-accent` + `text-sidebar-accent-foreground` for hover) — already defined for both light and dark themes in `app/globals.css`. Don't hardcode a sidebar color or force `className="dark"` on it; the tokens already give it a distinct surface in both themes.
33. A new top-level admin nav destination goes in `components/layout/admin-nav-items.ts` (one array, read by both `Sidebar` and `Topbar`) — never add a link directly inside `Sidebar.tsx` or duplicate the list in `Topbar.tsx`.
34. Anything sensitive persisted to `localStorage` goes through `localStorageHelper` (`lib/local-storage.ts`), never a raw `window.localStorage.setItem`/`getItem` call — see "Client-Side Local Storage" above. It is encryption-at-rest for casual inspection, not an auth boundary: never branch an access-control or redirect decision on a value it returns.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
