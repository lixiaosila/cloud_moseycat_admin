export const menus = [
  {
    path: '/info', title: '信息管理', icon: 'copy',
    children: [
      { path: '/info/order', title: '订单列表' },
      { path: '/info/chart', title: '订单图表' },
    ],
  },
  {
    path: '/update', title: '定制师管理', icon: 'team',
    children: [
      { path: '/update/banner', title: '定制师banner' },
      { path: '/update/guider', title: '定制师列表' },
      { path: '/update/custom/:id', title: '定制师编辑' },
    ],
  },
  {
    path: '/scene', title: '景点管理', icon: 'scan',
    children: [
      { path: '/scene/list', title: '景点列表' },
      { path: '/scene/custom/:id', title: '景点编辑' },
    ],
  },
  {
    path: '/permission', title: '权限管理', icon: 'rocket', permission: 'super',
    children: [
      { path: '/permission/manage', title: '管理员列表'},
    ],
  },
]