import { ReactNode, useContext, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Collapse,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

import { LayoutContext } from '../context'
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../constants'
import type { ExtendedRouteObject } from '@/models/route.model'

interface SNBProps {
  title: string
  subtitle?: string
  version?: string
  routes: ExtendedRouteObject[]
}

interface SNBItemProps {
  route: ExtendedRouteObject
}

export default function SNB({ title, subtitle, version, routes }: SNBProps) {
  const drawerRef = useRef(null)
  const { isDesktop, isSNBOpen, toggleSNB } = useContext(LayoutContext)

  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: 'neutral.100',
          width: SIDEBAR_WIDTH,
          border: 0,
        },
      }}
      variant={isDesktop ? 'persistent' : 'temporary'}
      open={isSNBOpen}
      onClose={toggleSNB}
      ref={drawerRef}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backgroundColor: 'inherit',
          minHeight: NAVBAR_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'neutral.700',
        }}
      >
        <Stack direction="row" spacing={0.5} alignItems="end">
          <Typography variant="h6">{title}</Typography>

          {version && <Typography variant="caption">v{version}</Typography>}
        </Stack>

        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      <List sx={{ my: 1 }}>
        {routes.map((route) => {
          const isHidden = route.meta.hidden
          const hasChild = route.children && route.children.length > 0

          if (isHidden) return null

          return hasChild ? (
            <SNBMultipleItem key={route.meta.name} route={route} />
          ) : (
            <SNBSingleItem key={route.meta.name} route={route} />
          )
        })}
      </List>
    </Drawer>
  )
}

const SNBMultipleItem = ({ route }: SNBItemProps) => {
  const { pathname } = useLocation()
  const { isSNBItemOpenMap, toggleSNBItemMap } = useContext(LayoutContext)

  const children = route.children || []

  const itemPath = route.path || ''
  const basePath = pathname.split('/').filter(Boolean)[0]
  const isActive = basePath === itemPath

  const itemName = route.meta.name || ''
  const itemIcon = route.meta.icon || null

  const isOpen = isSNBItemOpenMap[itemName] || false

  const handleClick = (key: string) => {
    toggleSNBItemMap(key)
  }

  return (
    <>
      <ListItem sx={{ px: 2, py: 0, mb: 1 }}>
        <Button
          sx={{
            width: 1,
            color: isActive ? 'primary.main' : 'neutral.100',
            justifyContent: 'space-between',
            borderRadius: 1,
            px: 2,
            ...(isActive && { fontWeight: 'bold' }),
            '&:hover': {
              backgroundColor: 'neutral.800',
            },
          }}
          onClick={() => handleClick(itemName)}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <SNBItemLabel icon={itemIcon} name={itemName} />
          </Stack>

          {isOpen ? (
            <ExpandLessIcon sx={{ mr: -1 }} />
          ) : (
            <ExpandMoreIcon sx={{ mr: -1 }} />
          )}
        </Button>
      </ListItem>

      {children.map((childRoute: ExtendedRouteObject) => {
        const isHidden = childRoute.meta.hidden
        if (isHidden) return null

        const subItemPath = childRoute.path || ''
        const subBasePath = pathname.split('/').filter(Boolean).join('/')
        const fullPath = [itemPath, ...subItemPath.split('/')]
          .filter(Boolean)
          .join('/')
        const isSubActive = subBasePath === fullPath

        const subItemName = childRoute.meta.name || ''

        return (
          <Collapse key={subItemName} in={isOpen} timeout="auto" unmountOnExit>
            <ListItem sx={{ py: 0, px: 2, mb: 1 }}>
              <Button
                sx={{
                  width: 1,
                  color: isSubActive ? 'primary.main' : 'neutral.100',
                  justifyContent: 'start',
                  borderRadius: 1,
                  px: 2,
                  ...(isSubActive && { backgroundColor: 'neutral.800' }),
                  ...(isSubActive && { fontWeight: 'bold' }),
                  '&:hover': {
                    backgroundColor: 'neutral.800',
                  },
                }}
                component={Link}
                to={fullPath}
              >
                <SNBItemSubLabel name={subItemName} isActive={isSubActive} />
              </Button>
            </ListItem>
          </Collapse>
        )
      })}
    </>
  )
}

const SNBSingleItem = ({ route }: SNBItemProps) => {
  const { pathname } = useLocation()

  const itemPath = route.path || ''
  const basePath = pathname.split('/').filter(Boolean)[0]
  const isActive = basePath === itemPath

  const itemName = route.meta.name || ''
  const itemIcon = route.meta.icon || null

  return (
    <ListItem sx={{ px: 2, py: 0, mb: 1 }}>
      <Button
        sx={{
          width: 1,
          color: isActive ? 'primary.main' : 'neutral.100',
          justifyContent: 'start',
          borderRadius: 1,
          px: 2,
          ...(isActive && { backgroundColor: 'neutral.800' }),
          ...(isActive && { fontWeight: 'bold' }),
          '&:hover': {
            backgroundColor: 'neutral.800',
          },
        }}
        component={Link}
        to={itemPath}
      >
        <SNBItemLabel icon={itemIcon} name={itemName} />
      </Button>
    </ListItem>
  )
}

const SNBItemLabel = ({ icon, name }: { icon: ReactNode; name: string }) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon && (
        <Box
          sx={{
            width: 20,
            height: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          component="span"
        >
          {icon}
        </Box>
      )}
      <Box component="span">{name}</Box>
    </Stack>
  )
}

const SNBItemSubLabel = ({
  name,
  isActive,
}: {
  name: string
  isActive: boolean
}) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 20,
          height: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        component="span"
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            ...(isActive && { backgroundColor: 'primary.main' }),
          }}
          component="span"
        ></Box>
      </Box>

      <Box component="span">{name}</Box>
    </Stack>
  )
}
