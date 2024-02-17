import authHandlers from '@/mocks/handlers/auth'
import artistHandlers from '@/mocks/handlers/artists'
import postHandlers from '@/mocks/handlers/posts'
import userHandlers from '@/mocks/handlers/users'

export const handlers = [
  ...authHandlers,
  ...artistHandlers,
  ...postHandlers,
  ...userHandlers,
]
