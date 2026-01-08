import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  async login(credentials) {
    try {
      const res = await api.post('/auth/login', credentials);

      const { accessToken, refreshToken, user } = res.data;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  },

  async register(userData) {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  },

  async verifyEmail(token) {
    try {
      const res = await api.get('/auth/verify-email', {
        params: { token },
      });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email verification failed');
      throw err;
    }
  },

  async getProfile() {
    try {
      const res = await api.get('/auth/profile');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch profile');
      throw err;
    }
  },

  logout() {
    localStorage.clear();
    window.location.replace('/login');
  },
};
