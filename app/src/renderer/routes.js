export default [
  {
    path: '/sessions',
    name: 'View Sessions',
    component: require('components/SessionsView'),
    meta: {title: 'Sessions'},
    children: [
      {
        path: 'add',
        component: require('components/NewSession'),
        meta: {title: 'Sessions'}
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: require('components/SettingsView'),
    meta: {title: 'Settings'}
  },
  {
    path: '*',
    redirect: '/sessions'
  }
]
