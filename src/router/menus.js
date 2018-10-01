export const menus = [
  {
    path: '/info', title: '信息管理', icon: 'copy',
    children: [
      { path: '/info/order', title: '订单列表' },
      { path: '/info/chart', title: '订单图表' },
    ],
  },
  {
    path: '/update', title: '信息更新', icon: 'scan',
    children: [
      { path: '/update/guider', title: '定制师列表' },
    ],
  },
  {
    path: '/permission', title: '权限管理', icon: 'rocket', permission: 'super',
    children: [
      { path: '/permission/manage', title: '管理员列表'},
    ],
  },
]