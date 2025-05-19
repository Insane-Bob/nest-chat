import axios from 'axios';

const API_URL = 'http://localhost:3000/chats/   ';

export const createChat = async (token, participants) => {
    try {
        const response = await axios.post(`${API_URL}chats`, { participants }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getChats = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/chats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}