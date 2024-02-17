import { Person as PersonIcon } from '@mui/icons-material'

import { Users, User } from '@/pages'
import type { ExtendedRouteObject } from '@/models/route.model'

const routes: ExtendedRouteObject = {
  path: 'users',
  meta: {
    name: '회원관리',
    hidden: false,
    icon: <PersonIcon fontSize="small" />,
  },
  children: [
    {
      path: '',
      element: <Users />,
      meta: { name: '회원목록', hidden: false },
    },
    {
      path: ':id',
      element: <User />,
      meta: { name: '회원상세정보', hidden: true },
    },
  ],
}

export default routes
