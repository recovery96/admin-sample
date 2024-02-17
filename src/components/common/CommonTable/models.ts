import { ReactNode } from 'react'

export type Order = 'asc' | 'desc'

export interface Row {
  id: string
  [key: string]: ReactNode
}

export interface Column {
  id: string
  label: string
  align?: 'center' | 'left' | 'right'
  sortable?: boolean
}

export interface Pagination {
  page: number
  count: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
}

export interface Sort {
  order: Order
  orderBy: string
}

type PaginationProps =
  | {
      pagination: Pagination
      onPaginationChange: (pagination: Pagination) => void
    }
  | { pagination?: never; onPaginationChange?: never }

type SortProps =
  | {
      sort: Sort
      onSortChange: (sort: Sort) => void
    }
  | { sort?: never; onSortChange?: never }

type SelectionProps =
  | {
      selection: string[]
      onSelectionChange: (selection: string[]) => void
    }
  | { selection?: never; onSelectionChange?: never }

export type CommonTableProps = {
  columns: Column[]
  rows: Row[]
  onRowClick?: () => void
} & PaginationProps &
  SortProps &
  SelectionProps
