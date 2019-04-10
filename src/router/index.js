import Error401 from '@/views/error/401'
import Error404 from '@/views/error/404'
import UserDetail from '@/views/user/detail'
import UserLottery from '@/views/user/lottery'
import Config from '@/views/config/index'

export const routes = [
    { path: '/user/detail', component: UserDetail },
    { path: '/user/lottery', component: UserLottery },
    { path: '/config/info', component: Config },
    { path: '/error/401', component: Error401},
    { path: '/error/404', component: Error404},
]
