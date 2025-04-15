import type { BetterAuthOptions } from 'better-auth'
import { admin, openAPI } from 'better-auth/plugins'

export default {
  disabledPaths: [],
  plugins: [
    openAPI(),
    admin(),
  ],
  trustedOrigins: [],
} satisfies BetterAuthOptions
