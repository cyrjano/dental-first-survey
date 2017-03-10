export default [
  {
    path: '/sessions',
    name: 'View Sessions',
    component: require('components/SessionsView'),
    children:[
      {
        path:'add',
        component:require('components/NewSession')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: require('components/SettingsView')
  },
  {
    path: '*',
    redirect: '/sessions'
  }
]
