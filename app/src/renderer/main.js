import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'
import 'jquery'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App'
import routes from './routes'
import Octicon from './components/Octicon.vue'
Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.component('octicon', Octicon)
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => function () { return {y: 0} },
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
