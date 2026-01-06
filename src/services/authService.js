import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error(error.response?.data?.message || 'Email verification failed');
      throw error;
    }
  },

  // Logout user (clears localStorage)
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get authenticated user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
      throw error;
    }
  },
};
