    import { defineStore } from 'pinia'

    export interface User {
        username: string
        color: string
        avatar?: string
    }

    export const useUserStore = defineStore('user', {
        state: () => ({
            user: null as User | null,
            token: null as string | null,
        }),
        getters: {
            isLoggedIn: (state) => !!state.token,
        },
        actions: {
            setUser(user: User) {
                this.user = user
            },
            setToken(token: string) {
                this.token = token
            },
            logout() {
                this.user = null
                this.token = null
                localStorage.removeItem('jwt')
                localStorage.removeItem('user')
            },
            hydrateFromLocalStorage() {
                const token = localStorage.getItem('jwt')
                const user = localStorage.getItem('user')
                if (token && user) {
                    this.token = token
                    this.user = JSON.parse(user)
                }
            }
        },
    })
