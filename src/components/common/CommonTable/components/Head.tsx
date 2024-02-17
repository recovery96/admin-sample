import { ChangeEvent, useContext } from 'react'

import { TableContext } from '../context'
import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'

export default function Head() {
  const { rows, columns, sort, selection, onSortChange, onSelectionChange } =
    useContext(TableContext)

  const ids = rows.map((row) => row.id)

  const handleAllSelect = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (!selection || !onSelectionChange) return
    onSelectionChange(checked ? ids : [])
  }

  const handleSortChange = (id: string) => {
    if (!sort || !onSortChange) return
    onSortChange({
      orderBy: id,
      order: sort.orderBy === id && sort.order === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <TableHead>
      <TableRow>
        {selection && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                ids.every((id) => selection.includes(id)) &&
                selection.length !== 0 &&
                ids.length === selection.length
              }
              onChange={handleAllSelect}
            />
          </TableCell>
        )}

        {columns.map((column) => (
          <TableCell key={column.id} align={column.align || 'left'}>
            {sort && column.sortable ? (
              <TableSortLabel
                active={sort.orderBy === column.id}
                direction={sort.order}
                onClick={() => handleSortChange(column.id)}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
