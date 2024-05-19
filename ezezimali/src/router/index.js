import { createRouter, createWebHistory } from 'vue-router'
import Apply from '../views/ApplyFM.vue'
import PostFO from '../views/PostFO.vue'
import Reports from '../views/Reports.vue'
import Notification from '../views/Notifications.vue'
import FM from '../views/FMView.vue'
import ApplyFO from '../views/ApplyFO.vue'
import ViewFO from '../views/ViewFO.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/apply-funding-manager',
      name: 'apply-funding-manager',
      component: Apply
    },
    {
      path: '/view-funding-oppurtunities',
      name: 'view-funding-applications',
      component: ViewFO
    },
    {
      path: '/apply-funding-opportunity/:id',
      name: 'apply-funding-oppurtunity',
      component: ApplyFO
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notification
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin}
      ,{
      path: '/funding-applications',
      name: 'FA',
      component: FM
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