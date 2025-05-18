import axios from 'axios'

const API_URL = 'http://localhost:3000/auth/'

// Profile
export const profile = async (token) => {
    try {
        const response = await axios.post(
            `${API_URL}profile`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return response.data
    } catch (error) {
        throw new Error('Profile retrieval failed')
    }
}

// Update Profile
export const updateProfile = async (token, userId, updateUserDto) => {
    try {
        const response = await axios.put(`${API_URL}profile`, userId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};