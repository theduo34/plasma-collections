const KEY_PREFIX = "pc:"
const PBKDF2_ITERATIONS = 100_000

// AES-GCM–encrypted localStorage wrapper, keyed from NEXT_PUBLIC_LOCAL_STORAGE_SALT.
//
// The key necessarily ships in the browser bundle — anything that decrypts
// client-side has to have its key available client-side, there's no way
// around that on the web. This stops a casual glance at devtools →
// Application → Local Storage (or a script that greps localStorage for
// recognizable plaintext) from reading anything useful. It is NOT a
// substitute for server-side auth: never make an access-control decision
// based on a value read back from here. The real gate for admin routes is
// convex/sessionTokens.ts + app/(admin)/admin/[token]/layout.tsx, which
// re-validate against the database on every request regardless of what a
// client claims to have stored.
let cachedKey: Promise<CryptoKey> | null = null

function getPassphrase(): string {
  const passphrase = process.env.NEXT_PUBLIC_LOCAL_STORAGE_SALT
  if (!passphrase) {
    throw new Error(
      "NEXT_PUBLIC_LOCAL_STORAGE_SALT is not set. Generate one and add it to .env.local — see .env.local.example."
    )
  }
  return passphrase
}

function deriveKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = (async () => {
      const encoder = new TextEncoder()
      const passphrase = encoder.encode(getPassphrase())
      const material = await crypto.subtle.importKey("raw", passphrase, "PBKDF2", false, [
        "deriveKey",
      ])
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: passphrase, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      )
    })()
  }
  return cachedKey
}

function toBase64(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function encrypt(value: unknown): Promise<string> {
  const key = await deriveKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new TextEncoder().encode(JSON.stringify(value))
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext)
  return `${toBase64(iv)}.${toBase64(new Uint8Array(ciphertext))}`
}

// Returns null for anything that fails to decrypt — corrupted, tampered
// with, or encrypted under a since-rotated salt. AES-GCM's auth tag makes
// a wrong key or altered ciphertext fail loudly (a rejected promise), not
// silently produce garbage, so this never returns tampered data.
async function decrypt<T>(payload: string): Promise<T | null> {
  const [ivPart, ciphertextPart] = payload.split(".")
  if (!ivPart || !ciphertextPart) return null
  try {
    const key = await deriveKey()
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(ivPart) },
      key,
      fromBase64(ciphertextPart)
    )
    return JSON.parse(new TextDecoder().decode(plaintext)) as T
  } catch {
    return null
  }
}

export const localStorageHelper = {
  async set<T>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return
    window.localStorage.setItem(KEY_PREFIX + key, await encrypt(value))
  },

  async get<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem(KEY_PREFIX + key)
    if (!raw) return null
    const value = await decrypt<T>(raw)
    if (value === null) window.localStorage.removeItem(KEY_PREFIX + key)
    return value
  },

  has(key: string): boolean {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem(KEY_PREFIX + key) !== null
  },

  remove(key: string): void {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(KEY_PREFIX + key)
  },

  // Clears only keys this helper wrote (the pc: prefix) — never touches
  // unrelated localStorage data (e.g. the storefront cart).
  removeAll(): void {
    if (typeof window === "undefined") return
    const keysToRemove: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key?.startsWith(KEY_PREFIX)) keysToRemove.push(key)
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key))
  },
}
