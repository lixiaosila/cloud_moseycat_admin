import Dashboard from '@/views/dashboard'
import Error401 from '@/views/error/401'
import Error404 from '@/views/error/404'
import PermissionToggle from '@/views/permission/toggle'
import TableEdit from '@/views/table/edit'

export const routes = [

  { path: '/dashboard', component: Dashboard },
  { path: '/permission/manage', component: PermissionToggle },
  { path: '/table/edit', component: TableEdit },
  { path: '/error/401', component: Error401},
  { path: '/error/404', component: Error404},

]