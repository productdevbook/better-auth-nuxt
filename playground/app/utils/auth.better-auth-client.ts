import type { ClientOptions } from 'better-auth'
import { usernameClient, adminClient } from 'better-auth/client/plugins'

export default {
  plugins: [
    adminClient(),
    usernameClient(),
  ],
} satisfies ClientOptions
