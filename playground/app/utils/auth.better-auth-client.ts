import type { ClientOptions } from 'better-auth'
import { usernameClient, adminClient } from 'better-auth/client/plugins'

export default {
  plugins: [
    adminClient(),
    usernameClient(),
  ],
} satisfies ClientOptions

interface MiddlewareOptions {
  /**
   * Only apply auth middleware to guest or user
   */
  only?:
    | 'guest'
    | 'user'
    | 'member'
    | 'admin'
  /**
   * Redirect authenticated user to this route
   */
  redirectUserTo?: string
  /**
   * Redirect guest to this route
   */
  redirectGuestTo?: string
  redirectUnauthorizedTo?: string
}
declare module '#app' {
  interface PageMeta {
    autha?: MiddlewareOptions
  }
}
declare module 'vue-router' {
  interface RouteMeta {
    autha?: MiddlewareOptions
  }
}
export {}
