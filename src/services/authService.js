import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  // ---------------------------
  // LOGIN
  // ---------------------------
  async login(credentials) {
    try {
      const res = await api.post('/auth/login', credentials);

      // ✅ CORRECT extraction
      const { success, message, data } = res.data;

      if (!success || !data) {
        throw new Error(message || 'Invalid login response');
      }

      const { user, accessToken, refreshToken, twoFactorRequired } = data;

      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      return { user, accessToken, refreshToken, twoFactorRequired };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed';

      toast.error(msg);
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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed';
      toast.error(msg);
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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Email verification failed';
      toast.error(msg);
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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch profile';
      toast.error(msg);
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
