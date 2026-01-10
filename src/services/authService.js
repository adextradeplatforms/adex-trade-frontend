import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  // ---------------------------
  // LOGIN
  // ---------------------------
  async login(credentials) {
    try {
      const res = await api.post('/auth/login', credentials);
      const { user, accessToken, refreshToken, twoFactorRequired } = res.data;

      // Store tokens if present
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      // Return full data for frontend
      return { user, accessToken, refreshToken, twoFactorRequired };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      toast.error(message);
      throw err;
    }
  },

  // ---------------------------
  // REGISTER
  // ---------------------------
  async register(userData) {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed';
      toast.error(message);
      throw err;
    }
  },

  // ---------------------------
  // VERIFY EMAIL
  // ---------------------------
  async verifyEmail(token) {
    try {
      const res = await api.get('/auth/verify-email', {
        params: { token },
      });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Email verification failed';
      toast.error(message);
      throw err;
    }
  },

  // ---------------------------
  // GET PROFILE
  // ---------------------------
  async getProfile() {
    try {
      const res = await api.get('/auth/profile');
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch profile';
      toast.error(message);
      throw err;
    }
  },

  // ---------------------------
  // LOGOUT
  // ---------------------------
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.replace('/login');
  },
};
