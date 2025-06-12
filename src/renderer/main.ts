import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router'
import './style.css'

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Create and mount the Vue app
const app = createApp(App)

app.use(router)

app.mount('#app')
