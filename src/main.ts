import { createApp } from 'vue'
import App from './App.vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from './router'
import store, { key, Store } from './store'
import 'windi.css'
import { MutationTypes } from './store/mutations'

// Initialize Firebase
firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
})

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  ;(store as Store).commit(MutationTypes.SET_USER, user)
  createApp(App).use(store, key).use(router).mount('#app')

  // calls on auth state change
  unsubscribe()
})
