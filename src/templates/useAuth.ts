import type { ModuleOptions } from '../module'

export async function serverAuth({ options }: {
  options: {
    moduleOptions: ModuleOptions
    configs: any
  }
}) {
  return [
    'import mergeDeep from "@fastify/deepmerge"',
    'import { betterAuth } from "better-auth"',
    ...options.configs.map((config: any) => {
      return `import ${config.key} from "${config.path}"`
    }),
    'const betterAuthConfigs = mergeDeep({all: true})({},',
    '{',
    ...options.moduleOptions.options.server
      ? Object.entries(options.moduleOptions.options.server).map(([key, value]) => {
          return `    ${key}: ${JSON.stringify(value)},`
        })
      : [],
    '},',
    ...options.configs.map((config: any) => {
      return `${config.key},`
    }),
    ')',
    '',
    'let _auth',
    '',
    'export function useAuth() {',
    '  if (!_auth) {',
    '    _auth = betterAuth(betterAuthConfigs)',
    '  }',
    '  return _auth',
    '}',
    '',
    'export const auth = useAuth()',
    '',
  ].join('\n')
}
