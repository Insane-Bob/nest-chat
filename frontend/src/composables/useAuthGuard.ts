import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore.ts'

export function useAuthGuard() {
    const router = useRouter()
    const userStore = useUserStore()

    if (!userStore.token && localStorage.getItem('jwt')) {
        userStore.hydrateFromLocalStorage()
    }

    const isLoggedIn = computed(() => !!userStore.token)

    onBeforeMount(() => {
        if (!isLoggedIn.value) {
            router.push('/login')
        }
    })

    return { isLoggedIn }
}