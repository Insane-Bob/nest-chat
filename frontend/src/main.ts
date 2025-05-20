// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from '../src/stores/useUserStore.ts'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

// Pinia User
const userStore = useUserStore()
userStore.hydrateFromLocalStorage()

app.mount('#app')
