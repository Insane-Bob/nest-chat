import axios from 'axios';

const API_URL = 'http://localhost:3000/chats/';

export const createChat = async (token, { chatName, participants }) => {
    try {
        const response = await axios.post(`${API_URL}`, { chatName, participants }, {
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

export const deleteChat = async (token, chatId) => {
    try {
        const response = await axios.delete(`${API_URL}${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

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