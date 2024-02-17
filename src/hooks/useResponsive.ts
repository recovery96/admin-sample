import { useMediaQuery, useTheme } from '@mui/material'

export function useResponsive() {
  const theme = useTheme()

  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  return { isDesktop }
}
