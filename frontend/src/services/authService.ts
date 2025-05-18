import axios from 'axios'
import { useUserStore } from '@/stores/useUserStore.ts'

const API_URL = 'http://localhost:3000/auth/'

// Register
export const register = async (
    username: string,
    password: string,
    color: string
): Promise<void> => {
    try {
        await axios.post(`${API_URL}register`, {
            username,
            password,
            color,
        })
    } catch (error) {
        throw new Error('Registration failed')
    }
}

// Login
export const login = async (
    username: string,
    password: string
): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}login`, {
            username,
            password,
        })

        const token: string = response.data.access_token
        const user: SafeUser = response.data.user

        // Pinia Store
        const userStore = useUserStore()
        userStore.setToken(token)
        userStore.setUser(user)

        // Local Storage
        localStorage.setItem('jwt', token)
        localStorage.setItem('user', JSON.stringify(user))

        const { password: _, ...userWithoutPassword } = user.toObject();

        return {
            token,
            user: userWithoutPassword,
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed')
    }
}

// Logout
export const logout = async (): Promise<void> => {
    try {
        const userStore = useUserStore()
        userStore.logout()
        window.location.href = '/login'
    } catch (error) {
        throw new Error('Logout failed')
    }
}