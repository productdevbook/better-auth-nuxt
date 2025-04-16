export async function serverAuth({ options }: any) {
  return [
    'import mergeDeep from "@fastify/deepmerge"',
    'import { betterAuth } from "better-auth"',
    ...options.configs.map((config: any) => {
      return `import ${config.key} from "${config.path}"`
    }),
    'const betterAuthConfigs = mergeDeep({all: true})({},',
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
