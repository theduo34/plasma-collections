import { localStorageHelper } from "@/lib/local-storage"

const KEY = "admin-session"

type CachedAdminSession = {
  token: string
  cachedAt: number
}

// A client-side, encrypted-at-rest mirror of the current admin session
// token — tracked for visibility, never trusted for authorization or a
// redirect decision. "Already logged in → go straight to the dashboard"
// is handled server-side, by proxy.ts checking the real Convex Auth
// session and convex/sessionTokens.ts's current()/touch() re-checking the
// database on every request. A forged or stale entry here can't bypass
// that: at worst it points at a URL that
// app/(admin)/admin/[token]/layout.tsx immediately rejects and bounces
// home, exactly like having no session at all.
export const adminSessionCache = {
  save(token: string): Promise<void> {
    return localStorageHelper.set<CachedAdminSession>(KEY, { token, cachedAt: Date.now() })
  },

  read(): Promise<CachedAdminSession | null> {
    return localStorageHelper.get<CachedAdminSession>(KEY)
  },

  clear(): void {
    localStorageHelper.remove(KEY)
  },
}
