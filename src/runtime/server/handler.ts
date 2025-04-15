import { defineEventHandler, toWebRequest } from 'h3'
import { auth } from '#better-auth-configs'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
