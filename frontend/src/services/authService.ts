import axios from 'axios'

const API_URL = 'http://localhost:3000/auth/'

export const register = async (
    username: string,
    password: string,
    color: string
): Promise<void> => {
    try {
        const response = await axios.post(`${API_URL}register`, {
            username,
            password,
            color,
        });
        return response.data;
    } catch (error) {
        throw new Error('Registration failed');
    }
};

export const login = async (username: string, password: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}login`, {
            username,
            password
        })
        return response.data.access_token
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed')
    }
}
