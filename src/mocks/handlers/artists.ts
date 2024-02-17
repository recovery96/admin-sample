import { HttpResponse, http } from 'msw'
import dayjs from 'dayjs'

import { artists } from '@/mocks/data'
import type { Artist, ArtistData } from '@/models/artist.model'

let idx = artists.length + 1

const handlers = [
  http.get('/artists', ({ request }) => {
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

    const sortedArtists = [...artists]

    if (sort) {
      const [orderBy, order] = sort.split(',')
      const direction = order === 'asc' ? 1 : -1

      sortedArtists.sort((a, b) => {
        if (orderBy === 'name') {
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
    const paginatedArtists = sortedArtists.slice(start, end)

    return HttpResponse.json(
      {
        content: paginatedArtists,
        totalElements: artists.length,
      },
      { status: 200 },
    )
  }),

  http.get('/artists/:id', ({ params }) => {
    const { id } = params

    const artist = artists.find((artist) => artist.id === id)
    if (!artist) {
      return HttpResponse.json({}, { status: 404 })
    }

    return HttpResponse.json({ ...artist }, { status: 200 })
  }),

  http.post('/artists', async ({ request }) => {
    const data = (await request.json()) as ArtistData

    const newArtist: Artist = {
      id: `artist_${idx++}`,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      twitter: data.twitter || null,
      pixiv: data.pixiv || null,
    }
    artists.push(newArtist)

    return HttpResponse.json({ post: newArtist }, { status: 201 })
  }),

  http.put('/artists/:id', async ({ request, params }) => {
    const { id } = params
    const data = (await request.json()) as ArtistData

    const index = artists.findIndex((artist) => artist.id === id)
    if (index === -1) {
      return HttpResponse.json({}, { status: 400 })
    }
    const updatedArtist = { ...artists[index], ...data, updatedAt: new Date() }
    artists[index] = updatedArtist

    return HttpResponse.json({ artist: updatedArtist }, { status: 200 })
  }),

  http.delete('/artists/:id', ({ params }) => {
    const { id } = params

    const index = artists.findIndex((artist) => artist.id === id)
    if (index === -1) {
      return HttpResponse.json({}, { status: 400 })
    }
    artists.splice(index, 1)

    return HttpResponse.json({ status: 200 })
  }),

  http.post('/artists/bulk-delete', async ({ request }) => {
    const data = (await request.json()) as { ids: string[] }

    const deletedArtists = artists.filter((artist) =>
      data.ids.includes(artist.id),
    )
    deletedArtists.forEach((artist) => {
      const index = artists.findIndex((a) => a.id === artist.id)
      artists.splice(index, 1)
    })

    return HttpResponse.json({ status: 200 })
  }),
]

export default handlers
