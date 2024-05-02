import { createRouter, createWebHistory } from 'vue-router'
import Apply from '../views/ApplyFM.vue'
import PostFO from '../views/PostFO.vue'

import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/apply-funding-manager',
      name: 'apply-funding-manager',
      component: Apply
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/submit-funding-oppurtunity',
      name: 'submit-funding-oppurtunity',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: PostFO
    }
  ]
})

export default router
