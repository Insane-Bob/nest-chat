import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import ChatPage from '@/pages/chat/ChatPage.vue'
import ChatDetails from '@/components/chat/ChatDetails.vue'
import ChatForm from '@/components/chat/ChatForm.vue'
import RegisterPage from '@/pages/authentication/RegisterPage.vue'
import LoginPage from '@/pages/authentication/LoginPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'
import NotFoundPage from '@/pages/error/NotFoundPage.vue'

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
    { path: '/chats', component: ChatPage, meta: { requiresAuth: true } },
    { path: '/chat/create', component: ChatForm, meta: { requiresAuth: true } },
    {
        path: '/chat/:chatId',
        name: 'ChatDetails',
        component: ChatDetails,
        props: true,
    },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
    {
        path: '/profile', component: ProfilePage,
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

    const isAuthenticated = !!userStore.token

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login')
    }

    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
        return next('/profile')
    }

    return next()
})

export default router
