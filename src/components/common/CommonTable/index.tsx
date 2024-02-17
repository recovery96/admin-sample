import { ChangeEvent, MouseEvent, PropsWithChildren } from 'react'
import { Paper, Table, TableContainer, TablePagination } from '@mui/material'

import Head from './components/Head'
import Body from './components/Body'
import Content from './components/Content'
import { TableContext } from './context'
import type { CommonTableProps } from './models'

const CommonTable = ({
  columns,
  rows,
  pagination,
  sort,
  selection,
  onPaginationChange,
  onSortChange,
  onSelectionChange,
  children,
}: PropsWithChildren<CommonTableProps>) => {
  const handlePageChange = (
    _: MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    if (!pagination || !onPaginationChange) return
    onPaginationChange({ ...pagination, page })
  }

  const handleRowsPerPageChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (!pagination || !onPaginationChange) return
    onPaginationChange({
      ...pagination,
      rowsPerPage: parseInt(event.target.value),
    })
  }

  return (
    <TableContext.Provider
      value={{
        columns,
        rows,
        pagination,
        sort,
        selection,
        onSortChange,
        onSelectionChange,
      }}
    >
      <Paper>
        <TableContainer>
          <Table>{children}</Table>
        </TableContainer>

        {pagination && (
          <TablePagination
            component="div"
            page={pagination.page}
            count={pagination.count}
            rowsPerPage={pagination.rowsPerPage}
            rowsPerPageOptions={pagination.rowsPerPageOptions}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </Paper>
    </TableContext.Provider>
  )
}

CommonTable.Head = Head
CommonTable.Body = Body
CommonTable.Content = Content

export default CommonTable
