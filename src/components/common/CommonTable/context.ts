import { createContext } from 'react'
import { Column, Pagination, Row, Sort } from './models'

interface TableContextInterface {
  columns: Column[]
  rows: Row[]
  pagination?: Pagination
  sort?: Sort
  selection?: string[]
  onSortChange?: (sort: Sort) => void
  onSelectionChange?: (selection: string[]) => void
}

const defaultTableContext: TableContextInterface = {
  columns: [],
  rows: [],
}

export const TableContext =
  createContext<TableContextInterface>(defaultTableContext)
