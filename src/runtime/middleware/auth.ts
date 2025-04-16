import { defu } from 'defu'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserSession } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }

  const { loggedIn, options, fetchSession, session } = useUserSession()
  const { only, redirectUserTo, redirectGuestTo, redirectUnauthorizedTo } = defu(to.meta.auth, options)

  await fetchSession()

  // If guest mode, redirect if authenticated
  if (only === 'guest' && loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectUserTo) {
      return
    }
    return navigateTo(redirectUserTo)
  }

  // Handle user-only routes when user is not logged in
  if (only && only !== 'guest' && !loggedIn.value) {
    if (to.path === redirectGuestTo)
      return // Avoid infinite redirect
    return navigateTo(redirectGuestTo)
  }

  // Handle role-based authorization
  if (only && only !== 'guest' && loggedIn.value && session.value) {
    const userRole = (session.value as any).role || 'user'
    const requiredRoles = Array.isArray(only) ? only : [only]

    // Check if user has the required role
    if (!requiredRoles.includes(userRole) && !requiredRoles.includes('user')) {
      if (to.path === redirectUnauthorizedTo)
        return // Avoid infinite redirect
      return navigateTo(redirectUnauthorizedTo ?? '/401')
    }
  }
})
