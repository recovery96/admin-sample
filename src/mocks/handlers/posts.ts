import { HttpResponse, http } from 'msw'
import dayjs from 'dayjs'

import { artists, posts } from '@/mocks/data'
import { filterOptionsByValue, postTypeOptions } from '@/utils/filter'
import type { PostData } from '@/models/post.model'

let idx = posts.length + 1

const handlers = [
  http.get('/posts', ({ request }) => {
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

    const sortedPosts = [...posts].map((post) => {
      const artist = artists.find((artist) => artist.id === post.artistId)
      return {
        ...post,
        artist: artist
          ? {
              id: artist.id,
              name: artist.name,
            }
          : null,
      }
    })

    if (sort) {
      const [orderBy, order] = sort.split(',')
      const direction = order === 'asc' ? 1 : -1

      sortedPosts.sort((a, b) => {
        if (orderBy === 'title') {
          return (
            direction *
            a[orderBy].localeCompare(b[orderBy], undefined, { numeric: true })
          )
        } else if (orderBy === 'type') {
          const typeA = filterOptionsByValue(postTypeOptions, a[orderBy])
          const typeB = filterOptionsByValue(postTypeOptions, b[orderBy])
          return direction * typeA.localeCompare(typeB)
        } else if (orderBy === 'artist') {
          const nameA = a.artist?.name || '\uFFFF'
          const nameB = b.artist?.name || '\uFFFF'
          return (
            direction * nameA.localeCompare(nameB, undefined, { numeric: true })
          )
        } else if (orderBy === 'createdAt' || orderBy === 'updatedAt') {
          return direction * dayjs(a[orderBy]).diff(dayjs(b[orderBy]))
        }
        return 0
      })
    }

    const start = page * rowsPerPage
    const end = start + rowsPerPage
    const paginatedPosts = sortedPosts.slice(start, end)

    return HttpResponse.json(
      {
        content: paginatedPosts,
        totalElements: posts.length,
      },
      { status: 200 },
    )
  }),

  http.get('/posts/:id', ({ params }) => {
    const { id } = params
    const post = posts.find((post) => post.id === id)

    if (!post) {
      return HttpResponse.json({}, { status: 404 })
    }

    const artist = artists.find((artist) => artist.id === post.artistId)

    return HttpResponse.json(
      {
        ...post,
        artist: artist
          ? {
              id: artist.id,
              name: artist.name,
            }
          : null,
      },
      { status: 200 },
    )
  }),

  http.post('/posts', async ({ request }) => {
    const data = (await request.json()) as PostData

    const artist = artists.find((artist) => artist.id === data.artistId)

    if (!artist) {
      return HttpResponse.json({}, { status: 400 })
    }

    const newPost = {
      id: `post_${idx++}`,
      title: data.title,
      type: data.type,
      artistId: artist.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    posts.push(newPost)

    return HttpResponse.json({ post: newPost }, { status: 201 })
  }),

  http.put('/posts/:id', async ({ request, params }) => {
    const { id } = params
    const data = (await request.json()) as PostData

    const index = posts.findIndex((post) => post.id === id)
    if (index === -1) {
      return HttpResponse.json({}, { status: 404 })
    }

    const artist = artists.find((artist) => artist.id === data.artistId)
    if (!artist) {
      return HttpResponse.json({}, { status: 400 })
    }

    const updatedPost = {
      ...posts[index],
      title: data.title,
      type: data.type,
      artistId: artist.id,
      updatedAt: new Date(),
    }
    posts[index] = updatedPost

    return HttpResponse.json({ post: updatedPost }, { status: 200 })
  }),

  http.delete('/posts/:id', ({ params }) => {
    const { id } = params

    const index = posts.findIndex((post) => post.id === id)
    if (index === -1) {
      return HttpResponse.json({}, { status: 404 })
    }
    posts.splice(index, 1)

    return HttpResponse.json({ status: 200 })
  }),

  http.post('/posts/bulk-delete', async ({ request }) => {
    const data = (await request.json()) as { ids: string[] }

    const deletedPosts = posts.filter((post) => data.ids.includes(post.id))
    deletedPosts.forEach((post) => {
      const index = posts.findIndex((a) => a.id === post.id)
      posts.splice(index, 1)
    })

    return HttpResponse.json({ status: 200 })
  }),
]

export default handlers
