/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ClientOptions } from 'better-auth'
import { useRuntimeConfig } from '#app'

export interface ModuleServerOptions extends ClientOptions {}

export const defineBetterAuthClient = (config: () => ModuleServerOptions) => {
  return config
}

export default defineBetterAuthClient(() => {
  const { client } = useRuntimeConfig().public.betterAuth
  const options = typeof client === 'string' ? {} : client
  return {
    ...options,
  }
})
