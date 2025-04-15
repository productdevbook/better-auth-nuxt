import type { BetterAuthOptions } from 'better-auth'
import { openAPI } from 'better-auth/plugins'

export default {
  disabledPaths: [],
  plugins: [
    openAPI(),
  ],
  trustedOrigins: [],
} satisfies BetterAuthOptions
