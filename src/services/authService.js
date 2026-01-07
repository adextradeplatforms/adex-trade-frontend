import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      console.error('Register error:', err);
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  },

  verifyEmail: async (token) => {
    try {
      const res = await api.get(`/auth/verify-email?token=${token}`);
      return res.data;
    } catch (err) {
      console.error('Verify email error:', err);
      toast.error(err.response?.data?.message || 'Email verification failed');
      throw err;
    }
  },

  getProfile: async () => {
    try {
      const res = await api.get('/auth/profile');
      return res.data;
    } catch (err) {
      console.error('Get profile error:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch profile');
      throw err;
    }
  },

  logout: () => localStorage.clear(),
};
