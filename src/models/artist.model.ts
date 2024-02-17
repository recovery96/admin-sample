import { Pagination } from '@/models/pagination.model'

export interface Artist {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  twitter: string | null
  pixiv: string | null
}

export interface ArtistList {
  content: Artist[]
  totalElements: number
}

export interface ArtistFilter extends Pagination {
  sort?: string
}

export interface ArtistData {
  name: string
  twitter?: string
  pixiv?: string
}
