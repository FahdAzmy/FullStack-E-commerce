import axios from 'axios';
import { env } from '@/lib/env';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Only redirect to login if the user actually had a token (session expired).
      // If there was no token, the user is simply a guest — don't redirect.
      const hadToken = !!Cookies.get('token');
      Cookies.remove('token');
      Cookies.remove('user');

      if (hadToken && typeof window !== 'undefined') {
        // Don't redirect if already on an auth page to prevent loops
        const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
        const isOnAuthPage = authPaths.some((p) => window.location.pathname.startsWith(p));
        if (!isOnAuthPage) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
