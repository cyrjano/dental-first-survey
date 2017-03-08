export default [
  {
    path: '/',
    name: 'View Sessions',
    component: require('components/SessionsView')
  },
  {
    path: '*',
    redirect: '/'
  }
]
