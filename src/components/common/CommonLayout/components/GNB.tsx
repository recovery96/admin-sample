import { useContext } from 'react'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'

import { LayoutContext } from '../context'
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../constants'

interface GNBProps {
  username: string
  onSignout: () => void
}

export default function GNB({ username, onSignout }: GNBProps) {
  const theme = useTheme()
  const { isDesktop, isSNBOpen, toggleSNB } = useContext(LayoutContext)

  const handleClick = () => {
    toggleSNB()
  }

  const handleSignout = () => {
    onSignout()
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar
        sx={{
          height: NAVBAR_HEIGHT,
          ...(isDesktop && isSNBOpen && { marginLeft: `${SIDEBAR_WIDTH}px` }),
          transition: isSNBOpen
            ? theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              })
            : theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          boxShadow: theme.shadows[1],
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <IconButton size="large" sx={{ mr: 2 }} onClick={handleClick}>
          <MenuIcon />
        </IconButton>

        <Box
          sx={{ display: 'flex', alignItems: 'center', color: 'neutral.500' }}
        >
          <AccountCircleIcon sx={{ mr: 1 }} />
          <Typography
            sx={{
              mr: 2,
              position: 'relative',

              '&::after': {
                content: '""',
                position: 'absolute',
                height: 0.5,
                width: '1px',
                backgroundColor: 'neutral.300',
                ml: 2,
                top: '50%',
                transform: 'translateY(-50%)',
              },
            }}
            variant="body2"
          >
            {username} 님
          </Typography>

          <IconButton
            size="large"
            onClick={handleSignout}
            sx={{ borderRadius: 0, ml: 1 }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">로그아웃</Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
