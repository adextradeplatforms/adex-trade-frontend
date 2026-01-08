import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_URL is not defined');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // change only if backend uses cookies
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const language = localStorage.getItem('language') || 'en';

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers['Accept-Language'] = language;
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response || !error.config) {
      toast.error('Network error');
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) {
          forceLogout();
          return Promise.reject(error);
        }

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        forceLogout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

function forceLogout() {
  localStorage.clear();
  toast.error('Session expired. Please login again.');
  window.location.replace('/login');
}

export default api;
