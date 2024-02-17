import { lazy } from 'react'

export const Login = lazy(() => import('@/pages/common/login'))
export const NotFound = lazy(() => import('@/pages/common/404'))

export const Statistics = lazy(() => import('@/pages/statistics'))

export const Posts = lazy(() => import('@/pages/posts'))
export const Post = lazy(() => import('@/pages/posts/[id]'))

export const Users = lazy(() => import('@/pages/users'))
export const User = lazy(() => import('@/pages/users/[id]'))

export const Artists = lazy(() => import('@/pages/artists'))
export const Artist = lazy(() => import('@/pages/artists/[id]'))
