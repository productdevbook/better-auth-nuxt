import { defu } from 'defu'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth } from '#better-auth-configs'

type MiddlewareOptions = false | {
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
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, options, fetchSession, session } = useAuth()
  const { only, redirectUserTo, redirectGuestTo, redirectUnauthorizedTo } = defu(to.meta?.auth, options)

  // If client-side, fetch session between each navigation
  if (import.meta.client) {
    await fetchSession()
  }

  // Redirect logged-in users away from auth pages
  if (loggedIn.value && to.path.startsWith('/auth/')) {
    // Avoid infinite redirect
    if (to.path === redirectUserTo) {
      return
    }
    return navigateTo(redirectUserTo)
  }

  // If guest mode, redirect if authenticated
  if (only === 'guest' && loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectUserTo) {
      return
    }
    return navigateTo(redirectUserTo)
  }

  if (only && only !== 'guest' && !loggedIn.value) {
    if (to.path === redirectGuestTo)
      return // Avoid infinite redirect
    return navigateTo(redirectGuestTo)
  }

  //  && !hasPerm(session.value.user.permissions, only)
  if (only && only !== 'guest' && session.value) {
    if (to.path === redirectUnauthorizedTo)
      return // Avoid infinite redirect
    return navigateTo(redirectUnauthorizedTo ?? '/401')
  }
})
