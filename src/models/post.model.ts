import type { Pagination } from '@/models/pagination.model'

export type PostType = 'illust' | 'manga' | 'novel'

export interface Post {
  id: string
  title: string
  type: PostType
  artist: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface PostList {
  content: Post[]
  totalElements: number
}

export interface PostFilter extends Pagination {
  sort?: string
}

export interface PostData {
  title: string
  type: PostType
  artistId: string
}

// export interface PostData extends Omit<Post, 'id'> {}
