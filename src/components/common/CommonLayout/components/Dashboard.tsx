import { type PropsWithChildren, useContext } from 'react'
import { Box, useTheme } from '@mui/material'

import { LayoutContext } from '../context'
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../constants'

export default function Dashboard({ children }: PropsWithChildren) {
  const theme = useTheme()
  const { isDesktop, isSNBOpen } = useContext(LayoutContext)

  return (
    <Box
      component="main"
      sx={{
        mt: `${NAVBAR_HEIGHT}px`,
        ml: isDesktop && isSNBOpen ? `${SIDEBAR_WIDTH}px` : 0,
        px: 2,
        pt: 2,
        transition: isSNBOpen
          ? theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            })
          : theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
      }}
    >
      {children}
    </Box>
  )
}
