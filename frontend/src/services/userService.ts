import axios from 'axios';

const API_URL = 'http://localhost:3000/users/';

export const findAllUsers = async (token) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
};

export const profile = async (token) => {
    return axios.get(`${API_URL}profile`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
};

export const updateProfile = async (token, userData) => {
    return axios.put(`${API_URL}profile`, userData, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
};
