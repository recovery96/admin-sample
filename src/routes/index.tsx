import { Login, NotFound } from '@/pages'
import ProtectedRouteWrapper from '@/components/wrapper/ProtectedRouteWrapper'
import PrivateLayout from '@/components/layouts/PrivateLayout'
import PublicLayout from '@/components/layouts/PublicLayout'
import statisticsRoutes from '@/routes/statistics'
import postsRoutes from '@/routes/posts'
import usersRoutes from '@/routes/users'
import artistsRoutes from '@/routes/artists'

const privateRoutes = [
  statisticsRoutes,
  postsRoutes,
  usersRoutes,
  artistsRoutes,
]

const routes = [
  {
    path: '/',
    element: (
      <ProtectedRouteWrapper>
        <PrivateLayout />
      </ProtectedRouteWrapper>
    ),
    children: privateRoutes,
  },
  {
    path: '/login',
    element: (
      <ProtectedRouteWrapper>
        <PublicLayout>
          <Login />
        </PublicLayout>
      </ProtectedRouteWrapper>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export { routes, privateRoutes }
