import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import Login from '@/components/Login'
import constants from '@/constants'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: constants.path.LOGIN,
      component: Login,
      meta: {
        isPublic: true,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: constants.path.TOP,
      name: 'home',
      component: Home,
    },
  ],
})
