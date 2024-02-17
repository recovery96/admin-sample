import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

export type ExtendedRouteObject = RouteObject & {
  meta: {
    name: string
    hidden: boolean
    icon?: ReactNode
  }
  children?: ExtendedRouteObject[]
}
