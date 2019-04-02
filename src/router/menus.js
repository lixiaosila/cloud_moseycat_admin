export const menus = [
    {
        path: '/user', title: '用户管理', icon: 'team',
        children: [
            { path: '/user/detail', title: '用户列表' }
        ],
    },
    {
        path: '/config', title: '设置管理', icon: 'team',
        children: [
            { path: '/config/info', title: '配置详情' }
        ],
    }
]
