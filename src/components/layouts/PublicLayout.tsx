import { type PropsWithChildren } from 'react'
import { Box } from '@mui/material'

import ErrorBoundaryWrapper from '@/components/wrapper/ErrorBoundaryWrapper'
import SuspenseWrapper from '@/components/wrapper/SuspenseWrapper'
import { useNProgress } from '@/hooks/useNProgress'

export default function PublicLayout({ children }: PropsWithChildren) {
  useNProgress()

  return (
    <ErrorBoundaryWrapper>
      <Box component="main">
        <SuspenseWrapper>{children}</SuspenseWrapper>
      </Box>
    </ErrorBoundaryWrapper>
  )
}
