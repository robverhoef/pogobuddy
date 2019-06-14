import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Pokemap from './views/pokemap'
import Help from './views/help'
import ShinyStats from './views/shinystats'

Vue.use(Router)

export default new Router({
  base: '/',
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/shinystats',
          name: 'shinystats',
          component: ShinyStats
        },
        {
          path: '/help',
          name: 'help',
          component: Help
        },
        {
          path: '/',
          name: 'map',
          component: Pokemap
        },
        {
          path: '*',
          component: Pokemap
        }
      ]
    }
  ]
})
