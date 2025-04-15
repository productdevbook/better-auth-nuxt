import type { ClientOptions, InferSessionFromClient, InferUserFromClient } from 'better-auth'
import type { RouteLocationRaw } from 'vue-router'
import { adminClient, usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { defu } from 'defu'
import { computed, ref } from 'vue'
import { navigateTo, useRequestHeaders, useRequestURL, useRuntimeConfig, useState } from '#app'

export interface RuntimeAuthConfig {
  redirectUserTo: RouteLocationRaw | string
  redirectGuestTo: RouteLocationRaw | string
  redirectUnauthorizedTo: RouteLocationRaw | string
}

export interface AuthSignOutOptions {
  redirectTo?: RouteLocationRaw
}

let _authInstance: ReturnType<typeof createAuthInstance>

function createAuthInstance() {
  const url = useRequestURL()
  const headers = import.meta.server ? useRequestHeaders() : undefined
  const config = useRuntimeConfig()

  const authClient = createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
    plugins: [
      adminClient(),
      usernameClient(),
    ],
  })

  const options = defu(config.public.betterAuth.redirectOptions || {}, {
    redirectUserTo: '/profile',
    redirectGuestTo: '/signin',
    redirectUnauthorizedTo: '/401',
  })

  const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null)
  const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => null)
  const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

  const fetchSession = async () => {
    if (sessionFetching.value) {
      return
    }
    sessionFetching.value = true
    const { data } = await authClient.getSession({
      fetchOptions: {
        headers,
      },
    })
    session.value = data?.session || null
    user.value = data?.user || null
    sessionFetching.value = false
    return data
  }

  return {
    session,
    user,
    loggedIn: computed(() => !!session.value),
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    options,
    fetchSession,
    client: authClient,
    signOut: async ({ redirectTo }: AuthSignOutOptions = {}) => {
      try {
        await authClient.signOut()
        if (redirectTo)
          await navigateTo(redirectTo)
      }
      catch (error) {
        console.error('Sign out failed:', error)
        throw error
      }
    },
  }
}

// Setup session listener for client-side updates
function setupSessionListener(client: ReturnType<typeof createAuthInstance>['client']) {
  if (!import.meta.client)
    return

  client.$store.listen('$sessionSignal', async (signal) => {
    if (!signal)
      return
    await client.useSession($fetch)
  })
}

export function useAuth() {
  if (_authInstance && import.meta.client)
    return _authInstance

  const auth = createAuthInstance()

  if (import.meta.client) {
    setupSessionListener(auth.client)
    _authInstance = auth
  }

  return auth
}
