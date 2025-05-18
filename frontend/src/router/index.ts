import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

import ChatPage from '@/pages/chat/ChatPage.vue'
import RegisterPage from '@/pages/authentication/RegisterPage.vue'
import LoginPage from '@/pages/authentication/LoginPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'

const routes = [
    { path: '/', component: ChatPage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
    {
        path: '/profile'    ,
        component: ProfilePage,
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (!userStore.token && localStorage.getItem('jwt')) {
        userStore.hydrateFromLocalStorage()
    }

    if (to.meta.requiresAuth && !userStore.token) {
        next('/login')
    }
    else if ((to.path === '/login' || to.path === '/register') && userStore.token) {
        next('/profile')
    }
    else {
        next()
    }
})

export default router
