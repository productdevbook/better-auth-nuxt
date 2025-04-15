import { auth } from '#better-auth/server'

export default defineEventHandler(() => {
  const _test = auth.api.banUser({ body: {
    userId: 'test',
  } })
})
