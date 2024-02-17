import { Image as ImageIcon } from '@mui/icons-material'

import { Posts, Post } from '@/pages'
import type { ExtendedRouteObject } from '@/models/route.model'

const routes: ExtendedRouteObject = {
  path: 'posts',
  meta: {
    name: '작품관리',
    hidden: false,
    icon: <ImageIcon fontSize="small" />,
  },
  children: [
    {
      path: '',
      element: <Posts />,
      meta: { name: '작품목록', hidden: false },
    },
    {
      path: ':id',
      element: <Post />,
      meta: { name: '작품상세정보', hidden: true },
    },
  ],
}

export default routes
