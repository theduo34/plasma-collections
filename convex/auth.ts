import { convexAuth } from "@convex-dev/auth/server"
import { Password } from "@convex-dev/auth/providers/Password"

// Password only — accounts are created via users.createAdmin/createSuperAdmin, never self-serve.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  jwt: {
    // By default the JWT only carries `sub` — requireRole() (convex/lib/auth.ts)
    // looks the caller up by identity.email, so without this every requireRole()
    // call fails with "Forbidden" for every signed-in user, no exceptions.
    customClaims: async (ctx, { userId }) => {
      const user = await ctx.db.get(userId)
      return { email: user?.email }
    },
  },
})
