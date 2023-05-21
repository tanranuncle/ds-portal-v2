export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', name: 'welcome', icon: 'smile', component: './Welcome', hideInMenu: true },
  // { icon: 'table', name: '查询表单', path: '/list', component: './TableList' },
  { icon: 'euro', name: '询价单', path: '/inquiries', component: './InquiryList' },
  {
    path: '/inquiries/:name',
    name: '询价单详情',
    hideInMenu: true,
    component: './InquiryList/detail',
  },
  { icon: 'table', name: '商品库', path: '/goods', component: './GoodsList' },
  {
    path: '/goods/:sn',
    name: '商品详情',
    hideInMenu: true,
    component: './GoodsList/detail',
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
  {
    path: '/admin',
    icon: 'crown',
    name: '系统管理',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/users' },
      { path: '/admin/users', name: '用户管理', component: './Admin' },
      { path: '/admin/config', name: '运费配置', component: './ShippingConfig' },
      {
        path: '/admin/config/detail',
        hideInMenu: true,
        name: '配置详情',
        component: './ShippingConfig/detail',
      },
    ],
  },
];
