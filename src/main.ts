import { createApp } from 'vue'
import App from './App.vue'
import Firebase from 'firebase/app'
import router from './router'
import store from './store'
import 'windi.css'

// Initialize Firebase
Firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
})

createApp(App).use(store).use(router).mount('#app')
