import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global error handling
        if (error.response) {
            if (error.response.status === 401) {
                if (typeof window !== 'undefined') {
                    const hadToken = !!localStorage.getItem('token');
                    localStorage.removeItem('token');
                    document.cookie = 'auth-token=; path=/; max-age=0';
                    // Only redirect to login if the user had a token (expired session).
                    // If there was no token at all, the 401 is expected for optional-auth
                    // endpoints and we should not force a redirect.
                    if (hadToken && !window.location.pathname.startsWith('/auth')) {
                        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
