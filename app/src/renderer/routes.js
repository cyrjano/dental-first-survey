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
        meta: {title: 'Settings'}
      }
    ]
  },
  {
    path: '/import',
    name: 'import',
    component: require('components/ImportView'),
    meta: {title: 'Import Salesforce Data'}
  },
  {
    path: '*',
    redirect: '/sessions'
  }
]
