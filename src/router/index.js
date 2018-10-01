import Error401 from '@/views/error/401'
import Error404 from '@/views/error/404'
import PermissionToggle from '@/views/permission/toggle'
import TableEdit from '@/views/info/order'
import ChartShow from '@/views/info/chart'
import Guider from '@/views/update/guide'

export const routes = [
  { path: '/permission/manage', component: PermissionToggle},
  { path: '/info/order', component: TableEdit },
  { path: '/info/chart', component: ChartShow },
  { path: '/update/Guider', component: Guider },
  { path: '/error/401', component: Error401},
  { path: '/error/404', component: Error404},
]
