export default [
  {
    path: '/sessions',
    name: 'View Sessions',
    component: require('components/SessionsView'),
    meta: {title: 'Sessions'}
  },
  {
    path: '/settings',
    name: 'settings',
    component: require('components/SettingsView'),
    meta: {title: 'Settings'}
  },
  {
    path: '/surveys',
    name: 'surveys',
    component: require('components/SurveyView'),
    meta: {title: 'Capture Surveys'}
  },
  {
    path: '/editsurveys',
    name: 'editsurveys',
    component: require('components/EditSurveyView'),
    meta: {title: 'Edit Surveys'}
  },
  {
    path: '/findstudent',
    name: 'findstudent',
    component: require('components/FindStudentView'),
    meta: {title: 'Find Student from Roster'}
  },
  {
    path: '/verify',
    name: 'verify',
    component: require('components/VerifyView'),
    meta: {title: 'Verify'}
  },
  {
    path: '/print/:session',
    name: 'print',
    component: require('components/PrintView'),
    meta: {title: 'Print'}
  },
  {
    path: '*',
    redirect: '/sessions'
  }
]
