/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import fs from 'node:fs'
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  logger,
  addImportsDir,
  addServerHandler,
  addTemplate,
  addTypeTemplate,
} from '@nuxt/kit'
import type { BetterAuthOptions, ClientOptions } from 'better-auth'
import { defu } from 'defu'
import { resolve } from 'pathe'
import { hash } from 'ohash'
import * as templates from './templates'

export interface ModuleServerOptions extends Pick<BetterAuthOptions,
'appName' | 'baseURL' | 'basePath' | 'secret'> {}
export interface ModuleClientOptions extends ClientOptions {}

// Module options TypeScript interface definition
export interface ModuleOptions {
  baseUrl: string

  /**
   * auth endpoint
   * @default 'api/auth/**'
   */
  endpoint: string

  options: {
    /**
     * client options object or path to client setup script
     */
    client: ModuleClientOptions

    /**
     * server options object or path to server setup script
     */
    server: ModuleServerOptions
  }

  composables: {
    /**
     * @default 'useAuth'
     */
    client: string
    /**
     * @default 'auth'
     */
    server: string
  }

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
    endpoint: '/api/auth/**',
    composables: {
      client: 'useAuth',
      server: 'auth',
    },
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
      composables: {
        client: options.composables.client,
        server: options.composables.server,
      },
      redirectOptions: options.redirectOptions,
    })

    // alias runtime
    nuxt.options.alias['#better-auth'] = resolve('./runtime')

    addImportsDir(resolve('./runtime/composables'))

    addServerHandler({
      route: options.endpoint,
      handler: resolver.resolve('./runtime/server/handler'),
    })

    const registerTemplate: typeof addTemplate = (options) => {
      const name = (options as any).filename.replace(/\.m?js$/, '')
      const alias = '#' + name
      const results = addTemplate({
        ...options as any,
        write: true, // Write to disk for Nitro to consume
      })

      nuxt.options.nitro.alias ||= {}
      nuxt.options.nitro.externals ||= {}
      nuxt.options.nitro.externals.inline ||= []

      nuxt.options.alias[alias] = results.dst
      nuxt.options.nitro.alias[alias] = nuxt.options.alias[alias]
      nuxt.options.nitro.externals.inline.push(nuxt.options.alias[alias])
      nuxt.options.nitro.externals.inline.push(alias)
      return results as any
    }

    // mdc.config.ts support
    const serverConfigs: {
      key: string
      path: string
    }[] = [
      {
        key: hash('better-auth-configs'),
        path: resolver.resolve('./runtime/server'),
      },
    ]
    for (const layer of nuxt.options._layers) {
      let path = resolve(layer.config.serverDir!, 'utils/better-auth.config.ts')
      if (fs.existsSync(path)) {
        serverConfigs.push({
          key: hash(path),
          path,
        })
      }
      else {
        path = resolve(layer.config.serverDir!, 'utils/better-auth.config.js')
        if (fs.existsSync(path)) {
          serverConfigs.push({
            key: hash(path),
            path,
          })
        }
      }
    }

    registerTemplate({
      filename: 'better-auth-configs.mjs',
      getContents: templates.serverAuth,
      options: { configs: serverConfigs },
    })

    addTypeTemplate({
      filename: 'better-auth-configs.d.ts',
      getContents: () => {
        return [
          'import { betterAuth } from "better-auth"',
          'import mergeDeep from "@fastify/deepmerge"',
          ...serverConfigs.map((config) => {
            return `import ${config.key} from "${config.path}"`
          }),

          'const betterAuthConfigs = mergeDeep({all: true})({},',
          ...serverConfigs.map((config) => {
            return `${config.key},`
          }),
          ')',

          'export type BetterAuth = ReturnType<typeof betterAuth<typeof betterAuthConfigs>>',

          'export declare const useAuth: () => BetterAuth',
          'export declare const auth: BetterAuth',
        ].join('\n')
      },
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
