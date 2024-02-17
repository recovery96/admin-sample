import { Artist } from '@/models/artist.model'
import type { PostType } from '@/models/post.model'

export const artists: Artist[] = Array.from({ length: 100 }, (_, i) => {
  const random = Math.random()

  const date = new Date(
    `2024-01-${Math.floor(random * 31 + 1)
      .toString()
      .padStart(2, '0')}`,
  )
  const num = i + 1

  return {
    id: `artist_${num.toString()}`,
    name: `name_${num}`,
    createdAt: date,
    updatedAt: date,
    twitter: `twitter_${num}`,
    pixiv: `pixiv_${num}`,
  }
})

export const posts = Array.from({ length: 100 }, (_, i) => {
  const randomType = Math.random()
  const randomDate = Math.random()
  const randomArtist = Math.random()

  const type = ['illust', 'manga', 'novel'][
    Math.floor(randomType * 3)
  ] as PostType
  const date = new Date(
    `2024-01-${Math.floor(randomDate * 31 + 1)
      .toString()
      .padStart(2, '0')}`,
  )
  const artist = artists[Math.floor(randomArtist * 100)]
  const num = i + 1

  return {
    id: `post_${num.toString()}`,
    title: `title_${num}`,
    type,
    artistId: artist.id,
    createdAt: date,
    updatedAt: date,
  }
})

export const users = Array.from({ length: 100 }, (_, i) => {
  const random = Math.random()
  const date = new Date(
    `2024-01-${Math.floor(random * 31 + 1)
      .toString()
      .padStart(2, '0')}`,
  )
  const num = i + 1

  return {
    id: `user_${num.toString()}`,
    email: `email_${num}@gmail.com`,
    createdAt: date,
    updatedAt: date,
  }
})
