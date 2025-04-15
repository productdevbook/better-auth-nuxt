/* eslint-disable @typescript-eslint/no-empty-object-type */
import { defineNuxtModule, addPlugin, createResolver, logger, findPath, addImportsDir } from '@nuxt/kit'
import type { BetterAuthOptions, ClientOptions } from 'better-auth'
import { defu } from 'defu'
import { resolve } from 'pathe'

export interface ModuleServerOptions extends BetterAuthOptions {}
export interface ModuleClientOptions extends ClientOptions {}

// Module options TypeScript interface definition
export interface ModuleOptions {
  baseUrl: string

  /**
   * auth endpoint
   * @default '/auth'
   */
  endpoint: string

  /**
   * client options object or path to client setup script
   */
  client: ModuleClientOptions | string

  /**
   * server options object or path to server setup script
   */
  server: ModuleServerOptions | string

  /**
   * redirect options
   */
  redirectOptions: {
    redirectUserTo: string
    redirectGuestTo: string
    redirectUnauthorizedTo: string
  }
}

export interface ModulePublicRuntimeConfig {
  betterAuth: ModuleOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'better-auth',
    configKey: 'betterAuth',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    endpoint: '/auth',
    client: 'better-auth-client.config',
    server: 'better-auth-server.config',
    redirectOptions: {
      redirectUserTo: '/profile',
      redirectGuestTo: '/signin',
      redirectUnauthorizedTo: '/401',
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (!options.endpoint) {
      logger.withTag('better-auth').error('Missing endpoint option')
    }

    // expose public options
    nuxt.options.runtimeConfig.public.betterAuth = defu(nuxt.options.runtimeConfig.public.betterAuth, {
      baseUrl: options.baseUrl,
      endpoint: options.endpoint,
      client: options.client,
      server: options.server,
      redirectOptions: options.redirectOptions,
    })

    // alias runtime
    nuxt.options.alias['#better-auth'] = resolve('./runtime')

    // Load server options
    const defaultServerPath = resolver.resolve('./runtime/server')
    const serverPath = typeof options.server === 'string' ? ((await findPath(options.server)) ?? defaultServerPath) : defaultServerPath

    nuxt.options.alias['#better-auth-server'] = serverPath

    // Load client options
    const defaultClientPath = resolver.resolve('./runtime/client')
    const clientPath = typeof options.client === 'string' ? ((await findPath(options.client)) ?? defaultClientPath) : defaultClientPath

    nuxt.options.alias['#better-auth-client'] = clientPath

    addImportsDir(resolve('./runtime/composables'))

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
