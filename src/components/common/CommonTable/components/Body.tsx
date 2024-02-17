import { useContext } from 'react'
import { TableBody } from '@mui/material'

import Content from './Content'
import { TableContext } from '../context'
import type { Row } from '../models'

interface BodyProps {
  children?: (rows: Row[]) => JSX.Element[]
}

export default function Body({ children }: BodyProps) {
  const { rows } = useContext(TableContext)

  return (
    <TableBody>
      {children
        ? children(rows)
        : rows.map((row) => <Content key={row.id} row={row} />)}
    </TableBody>
  )
}
