import { createRouter, createWebHistory } from 'vue-router'
import Apply from '../views/ApplyFM.vue'
import PostFO from '../views/PostFO.vue'
import FM from '../views/FMView.vue'
import ApplyFO from '../views/ApplyFO.vue'
import ViewFO from '../views/ViewFO.vue'
import Dashboard from '../views/Dashboard.vue'
import FMReqs from '../views/FMReqs.vue'
import Reports from '../views/Reports.vue'
import Notification from '../views/Notifications.vue'
import admin from '../views/admin.vue'  
import updateProfile from '../views/updateProfile.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/apply-funding-manager',
      name: 'apply-funding-manager',
      component: Apply
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notification
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/funding-manager-applications',
      name: 'funding-manager-applications',
      component: FMReqs
    },
    {
      path: '/profile',
      name: 'profile',
      component: updateProfile
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
      path: '/funding-applications',
      name: 'FA',
      component: FM
    },
    {
      path: '/submit-funding-oppurtunity',
      name: 'submit-funding-oppurtunity',
      component: PostFO
    }
  ]
})



export default router
