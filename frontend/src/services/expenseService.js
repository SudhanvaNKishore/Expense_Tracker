import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:8000/api/expenses/';

// Create axios instance with base URL and default headers
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include token in every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getExpenses = async () => {
    try {
        const response = await api.get('expenses/');
        return response.data;
    } catch (error) {
        console.error('Error fetching expenses:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to fetch expenses' };
    }
};

export const addExpense = async (expenseData) => {
    try {
        console.log('Making request to add expense:', expenseData);
        const response = await api.post('expenses/', expenseData);
        console.log('Response from server:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding expense:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to add expense' };
    }
};

export const updateExpense = async (id, expenseData) => {
    try {
        const response = await api.put(`expenses/${id}/`, expenseData);
        return response.data;
    } catch (error) {
        console.error('Error updating expense:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to update expense' };
    }
};

export const deleteExpense = async (id) => {
    try {
        await api.delete(`expenses/${id}/`);
    } catch (error) {
        console.error('Error deleting expense:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to delete expense' };
    }
};
