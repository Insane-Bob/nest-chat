import { createWebHistory, createRouter } from 'vue-router'

import ChatPage from '@/pages/chat/ChatPage.vue'
import RegisterPage from '@/pages/authentication/RegisterPage.vue'
import LoginPage from '@/pages/authentication/LoginPage.vue'

const routes = [
    { path: '/', component: ChatPage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
