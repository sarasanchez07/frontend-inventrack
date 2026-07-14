import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refresh = sessionStorage.getItem("refresh");

                const response = await axios.post(
                    `${API_URL}/token/refresh/`,
                    { refresh }
                );

                const newAccess = response.data.access;

                sessionStorage.setItem("token", newAccess);

                api.defaults.headers.Authorization = `Bearer ${newAccess}`;

                processQueue(null, newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return api(originalRequest);

            } catch (err) {

                processQueue(err, null);

                sessionStorage.removeItem("token");
                sessionStorage.removeItem("refresh");

                window.location.href = "/login";

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;