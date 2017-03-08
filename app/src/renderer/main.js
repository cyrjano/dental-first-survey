import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './assets/main.css'
import App from './App'
import routes from './routes'

Vue.use(Electron);
Vue.use(Resource);
Vue.use(Router);
Vue.use(BootstrapVue);
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app');
