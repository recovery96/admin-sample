import { ChangeEvent, useContext } from 'react'
import { Checkbox, TableCell, TableRow } from '@mui/material'

import { TableContext } from '../context'
import type { Row } from '../models'

interface ContentProps {
  row: Row
}

export default function Content({ row }: ContentProps) {
  const { columns, selection, onSelectionChange } = useContext(TableContext)

  const handleOneSelect = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (!selection || !onSelectionChange) return
    onSelectionChange(
      checked
        ? [...selection, row.id]
        : selection.filter((id) => id !== row.id),
    )
  }

  return (
    <TableRow>
      {selection && (
        <TableCell padding="checkbox">
          <Checkbox
            sx={{ my: -1 }}
            checked={selection.includes(row.id)}
            onChange={handleOneSelect}
          />
        </TableCell>
      )}

      {columns.map((column) => (
        <TableCell key={column.id} align={column.align || 'left'}>
          {row[column.id]}
        </TableCell>
      ))}
    </TableRow>
  )
}
