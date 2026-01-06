import api from './api';

export const investmentService = {
  // Get all plans
  getPlans: async () => {
    const response = await api.get('/api/investments/plans');
    return response.data.data;
  },

  // Create an investment
  createInvestment: async (planId, amount) => {
    const response = await api.post('/api/investments/invest', { planId, amount });
    return response.data.data;
  },

  // Get user's investments
  getMyInvestments: async () => {
    const response = await api.get('/api/investments/my-investments');
    return response.data.data;
  },

  // Get investment by ID
  getInvestmentById: async (investmentId) => {
    const response = await api.get(`/api/investments/${investmentId}`);
    return response.data.data;
  },

  // Stop investment
  stopInvestment: async (investmentId) => {
    const response = await api.post(`/api/investments/${investmentId}/stop`);
    return response.data.data;
  },
};
