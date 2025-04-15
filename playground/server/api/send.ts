import { auth } from '#better-auth-configs'

export default defineEventHandler(() => {
  const _test = auth.api.banUser({ body: {
    userId: 'test',
  } })
})
