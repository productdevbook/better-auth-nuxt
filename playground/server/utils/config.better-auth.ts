import type { BetterAuthOptions } from 'better-auth'
import { admin, openAPI, username } from 'better-auth/plugins'

export default {
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    openAPI(),
    admin(),
    username(),
  ],
  trustedOrigins: [],
} satisfies BetterAuthOptions
