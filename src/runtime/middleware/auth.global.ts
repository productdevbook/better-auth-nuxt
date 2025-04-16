import { defu } from 'defu'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserSession } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, options, fetchSession, session } = useUserSession()
  const { only, redirectUserTo, redirectGuestTo, redirectUnauthorizedTo } = defu(to.meta?.auth, options)

  // If client-side, fetch session between each navigation
  if (import.meta.client) {
    await fetchSession()
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

  if (only && only !== 'guest' && session.value) {
    if (to.path === redirectUnauthorizedTo)
      return // Avoid infinite redirect
    return navigateTo(redirectUnauthorizedTo ?? '/401')
  }

  console.log('only', only, 'loggedIn', loggedIn.value, 'session', session.value)
})
