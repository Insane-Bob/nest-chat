import axios from 'axios';

const API_URL = 'http://localhost:3000/users/';

/**
 * Fetches all users from the API.
 * Sends a GET request to /users with the provided JWT token in the Authorization header.
 *
 * @param {string} token - JWT token for authentication.
 * @returns {Promise<Object[]>} - Promise resolving to an array of user objects.
 */
export const findAllUsers = async (token) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
};

/**
 * Fetches the profile of the currently authenticated user.
 * Sends a GET request to /users/me with the JWT token in the Authorization header.
 *
 * @param {string} token - JWT token for authentication.
 * @returns {Promise<Object>} - Promise resolving to the user profile object.
 */
export const profile = async (token) => {
    return axios.get(`${API_URL}profile`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
};

/**
 * Updates the profile of the currently authenticated user.
 * Sends a PUT request to /users/me with user data and the JWT token in the Authorization header.
 *
 * @param {string} token - JWT token for authentication.
 * @param {Object} userData - Object containing the user data to update.
 * @returns {Promise<Object>} - Promise resolving to the updated user profile object.
 */
export const updateProfile = async (token, userData) => {
    return axios.put(`${API_URL}profile`, userData, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
};
