import firebase from 'firebase'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import(/* webpackChunkName: "Index" */ '@/views/Index.vue')
  },
  {
    path: '/vue-chat',
    name: 'VueChat',
    component: () =>
      import(/* webpackChunkName: "Chat" */ '@/views/VueChat.vue'),
    beforeEnter: (_, _2, next) => {
      if (!firebase.auth().currentUser) {
        return next({ name: 'VueChat', hash: '#login' })
      }

      return next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
