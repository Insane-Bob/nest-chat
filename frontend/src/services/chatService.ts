import axios from 'axios';

const API_URL = 'http://localhost:3000/chats/';

export const createChat = async (token, { chatName, participants, visibility }) => {
    try {
        const response = await axios.post(`${API_URL}`, { chatName, participants, visibility }, {
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
        const response = await axios.get(`${API_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getChatDetails = async (token, chatId) => {
    try {
        const response = await axios.get(`${API_URL}${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const deleteChatById = async (chatId: string, token: string) => {
    try {
        console.log('DELETE request received for chatId:', chatId, token);
        const response = await axios.delete(`${API_URL}${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message || error;
    }
};

export const sendMessage = async (token, chatId, { content }) => {
    try {
        const response = await axios.post(`${API_URL}${chatId}/messages`, { content }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}