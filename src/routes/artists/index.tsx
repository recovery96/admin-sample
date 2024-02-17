import { Palette as PaletteIcon } from '@mui/icons-material'

import { Artists, Artist } from '@/pages'
import type { ExtendedRouteObject } from '@/models/route.model'

const routes: ExtendedRouteObject = {
  path: 'artists',
  meta: {
    name: '작가관리',
    hidden: false,
    icon: <PaletteIcon fontSize="small" />,
  },
  children: [
    {
      path: '',
      element: <Artists />,
      meta: { name: '작가목록', hidden: false },
    },
    {
      path: ':id',
      element: <Artist />,
      meta: { name: '작가상세정보', hidden: true },
    },
  ],
}

export default routes
