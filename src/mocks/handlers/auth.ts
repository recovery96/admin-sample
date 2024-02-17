import { HttpResponse, http } from 'msw'

const handlers = [
  http.post('/auth/signin', async ({ request }) => {
    const data = (await request.json()) as { email: string; password: string }

    if (data.email === 'tester@gmail.com' && data.password === 'tester123!') {
      return HttpResponse.json(
        { token: 'token', email: 'tester@gmail.com' },
        { status: 200 },
      )
    } else {
      return HttpResponse.json({}, { status: 400 })
    }
  }),
]

export default handlers
