/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { BetterAuthOptions } from 'better-auth'
import { useRuntimeConfig } from '#app'

export interface ModuleServerOptions extends BetterAuthOptions {}

export const defineBetterAuthServer = (config: () => ModuleServerOptions) => {
  return config
}

export default defineBetterAuthServer(() => {
  const { server } = useRuntimeConfig().public.betterAuth
  const options = typeof server === 'string' ? {} : server
  return {
    ...options,
  }
})
