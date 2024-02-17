import { BarChart as BarChartIcon } from '@mui/icons-material'

import { Statistics } from '@/pages'
import type { ExtendedRouteObject } from '@/models/route.model'

const routes: ExtendedRouteObject = {
  path: 'statistics',
  element: <Statistics />,
  meta: {
    name: '통계현황',
    hidden: false,
    icon: <BarChartIcon fontSize="small" />,
  },
}

export default routes
