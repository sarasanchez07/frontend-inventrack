import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
    },
    forgotPassword: async (email) => {
        return axios.post(`${API_URL}/auth/password-reset/`, { email });
    },
    resetPassword: async (email, password, confirm_password) => {
        return axios.post(`${API_URL}/auth/password-reset-confirm/`, { email, password, confirm_password });
    }
};

export default authService;
