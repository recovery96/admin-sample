import type { Pagination } from '@/models/pagination.model'

export interface User {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface UserList {
  content: User[]
  totalElements: number
}

export interface UserFilter extends Pagination {
  sort?: string
}

export interface UserData {
  email: string
}
