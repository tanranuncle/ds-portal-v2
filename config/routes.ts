export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', name: 'welcome', icon: 'smile', component: './Welcome', hideInMenu: true },
  // {
  //   path: '/admin',
  //   icon: 'crown',
  //   name: 'admin',
  //   access: 'canAdmin',
  //   routes: [
  //     { path: '/admin', redirect: '/admin/sub-page' },
  //     { path: '/admin/sub-page', name: 'subpage', component: './Admin' },
  //   ],
  // },
  // { icon: 'table', name: '查询表单', path: '/list', component: './TableList' },
  { icon: 'table', name: '询价单', path: '/inquiries', component: './InquiryList' },
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
];
