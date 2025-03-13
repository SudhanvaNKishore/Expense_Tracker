import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL
});

// Function to register user
export const register = async (userData) => {
    try {
        const response = await api.post('register/', userData);
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Registration failed' };
    }
};

// Function to login user
export const login = async (credentials) => {
    try {
        const response = await api.post('login/', credentials);
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Login failed' };
    }
};

// Function to logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// Function to get current user
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Function to check if user is logged in
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Add authorization header to requests
export const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}; 