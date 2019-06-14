import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueClipboards from 'vue-clipboards'
import Toastr from 'vue-toastr'
import VueCookies from 'vue-cookies'
import VuePageTransition from 'vue-page-transition'
require('./settings.js')

Vue.config.productionTip = false

Vue.use(Toastr)
Vue.use(VueCookies)
Vue.use(VueClipboards)
Vue.use(VuePageTransition)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
