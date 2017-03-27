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
    path: '*',
    redirect: '/sessions'
  }
]
