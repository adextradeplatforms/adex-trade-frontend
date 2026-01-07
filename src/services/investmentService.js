import api from './api';

export const investmentService = {
  getPlans: async () => {
    const res = await api.get('/investments/plans');
    return res.data.data;
  },

  createInvestment: async (planId, amount) => {
    const res = await api.post('/investments/invest', { planId, amount });
    return res.data.data;
  },

  getMyInvestments: async () => {
    const res = await api.get('/investments/my-investments');
    return res.data.data;
  },

  getInvestmentById: async (id) => {
    const res = await api.get(`/investments/${id}`);
    return res.data.data;
  },

  stopInvestment: async (id) => {
    const res = await api.post(`/investments/${id}/stop`);
    return res.data.data;
  },
};
