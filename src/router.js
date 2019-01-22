import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import store from '@/store/index.js'

Vue.use(Router)

export const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/get-started',
      name: 'tutorial',
      component: () => import(/* webpackChunkName: "tutorial" */ './views/Tutorial.vue')
    },
    {
      path: '/at-a-glance',
      name: 'at-a-glance',
      component: () => import(/* webpackChunkName: "at-a-glance" */ './views/AtAGlance.vue')
    },
    {
      path: '/services',
      name: 'inspection',
      component: () => import(/* webpackChunkName: "inspection" */ './views/Inspection.vue')
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import(/* webpackChunkName: "terms-and-conditions" */ './views/TermsAndConditions.vue')
    },
    {
      path: '/summary',
      name: 'summary',
      component: () => import(/* webpackChunkName: "summary" */ './views/Summary.vue')
    },
    {
      path: '/thank-you',
      name: 'thanks',
      component: () => import(/* webpackChunkName: "thanks" */ './views/Thanks.vue')
    },
    {
      path: '/link-expired',
      name: 'link-expired',
      component: () => import(/* webpackChunkName: "link-expired" */ './views/LinkExpired.vue')
    },
    {
      path: '/login/:slug',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      alias: 'not-found',
      name: 'notfound',
      component: () => import(/* webpackChunkName: "notfound" */ './views/NotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.expired) {
    if (to.name === 'link-expired' || to.name === 'login') {
      next()
    } else {
      next({
        name: 'link-expired'
      })
    }
  } else if (store.state.slug) {
    next()
  } else {
    if (to.name === 'login' && to.params.slug) {
      next()
    } else if (to.name === 'notfound') {
      next()
    } else {
      next({
        path: '/not-found'
      })
    }
  }
})

export default router
