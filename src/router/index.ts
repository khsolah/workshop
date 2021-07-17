import firebase from 'firebase/app'
import 'firebase/auth'
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
      import(
        /* webpackChunkName: "VueChat-Index" */ '@/views/VueChat/Index.vue'
      )
  },
  {
    path: '/vue-chat/chat',
    name: 'VueChat-chat',
    component: () =>
      import(/* webpackChunkName: "VueChat-Chat" */ '@/views/VueChat/Chat.vue'),
    beforeEnter: (_, _2, next) => {
      if (!firebase.auth().currentUser) {
        return next({ name: 'VueChat', hash: '#login' })
      }

      next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
