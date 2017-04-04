export default [
  {
    path: '/sessions',
    name: 'View Sessions',
    component: require('components/SessionsView'),
    meta: {title: 'Sessions'},
  },
  {
    path: '/settings',
    name: 'settings',
    component: require('components/SettingsView'),
    meta: {title: 'Settings'}
  },
  {
    path: '/surveys',
    name: 'survey',
    component:require('components/SurveyView'),
    meta: {title: 'Survey'}
  },
  {
    path: '/verify',
    name: 'verify',
    component:require('components/VerifyView'),
    meta: {title: 'Verify'}
  },
  {
    path:'/print/:session',
    name:'print',
    component:require('components/PrintView'),
    meta:{title:'Print'}
  },
  {
    path: '*',
    redirect: '/sessions'
  }
]
