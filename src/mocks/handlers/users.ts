import { HttpResponse, http } from 'msw'
import dayjs from 'dayjs'

import { users } from '@/mocks/data'
import type { User, UserData } from '@/models/user.model'

let idx = users.length + 1

const handlers = [
  http.get('/users', ({ request }) => {
    const url = new URL(request.url)

    const page = Number(url.searchParams.get('page'))
    const rowsPerPage = Number(url.searchParams.get('rowsPerPage'))
    const sort = url.searchParams.get('sort')

    if (Number.isNaN(page) || Number.isNaN(rowsPerPage)) {
      return HttpResponse.json(
        { content: [], totalElements: 0 },
        { status: 400 },
      )
    }

    const sortedUsers = [...users]

    if (sort) {
      const [orderBy, order] = sort.split(',')
      const direction = order === 'asc' ? 1 : -1

      sortedUsers.sort((a, b) => {
        if (orderBy === 'email') {
          return (
            direction *
            a[orderBy].localeCompare(b[orderBy], undefined, { numeric: true })
          )
        } else if (orderBy === 'createdAt' || orderBy === 'updatedAt') {
          return direction * dayjs(a[orderBy]).diff(dayjs(b[orderBy]))
        }
        return 0
      })
    }

    const start = page * rowsPerPage
    const end = start + rowsPerPage
    const paginatedUsers = sortedUsers.slice(start, end)

    return HttpResponse.json(
      {
        content: paginatedUsers,
        totalElements: users.length,
      },
      { status: 200 },
    )
  }),

  http.get('/users/:id', ({ params }) => {
    const { id } = params
    const user = users.find((user) => user.id === id)

    if (!user) {
      return HttpResponse.json({}, { status: 404 })
    }

    return HttpResponse.json({ ...user }, { status: 200 })
  }),

  http.post('/users', async ({ request }) => {
    const data = (await request.json()) as UserData

    const newUser: User = {
      id: `user_${idx++}`,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.push(newUser)

    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.put('/users/:id', async ({ request, params }) => {
    const { id } = params
    const data = (await request.json()) as UserData

    const index = users.findIndex((user) => user.id === id)
    if (index === -1) {
      return HttpResponse.json({}, { status: 400 })
    }
    const updatedUser = { ...users[index], ...data, updatedAt: new Date() }
    users[index] = updatedUser

    return HttpResponse.json({ user: updatedUser }, { status: 200 })
  }),

  http.delete('/users/:id', ({ params }) => {
    const { id } = params

    const index = users.findIndex((user) => user.id === id)
    if (index === -1) {
      return HttpResponse.json({}, { status: 400 })
    }
    users.splice(index, 1)

    return HttpResponse.json({ status: 200 })
  }),

  http.post('/users/bulk-delete', async ({ request }) => {
    const data = (await request.json()) as { ids: string[] }

    const deletedUsers = users.filter((user) => data.ids.includes(user.id))
    deletedUsers.forEach((user) => {
      const index = users.findIndex((a) => a.id === user.id)
      users.splice(index, 1)
    })

    return HttpResponse.json({ status: 200 })
  }),
]

export default handlers
