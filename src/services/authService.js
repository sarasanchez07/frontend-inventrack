import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
        if (response.data.access) {
            sessionStorage.setItem('token', response.data.access);
            sessionStorage.setItem('refresh', response.data.refresh);
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh');
        sessionStorage.removeItem('user');
    },
    forgotPassword: async (email) => {
        return axios.post(`${API_URL}/auth/password-reset/`, { email });
    },
    resetPassword: async (uidb64, token, password, confirm_password) => {
        return axios.post(`${API_URL}/auth/password-reset-confirm/`, { uidb64, token, password, confirm_password });
    }
};

export default authService;
