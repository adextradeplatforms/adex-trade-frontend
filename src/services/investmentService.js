import api from './api';

export const investmentService = {
  async getPlans() {
    const res = await api.get('/investments/plans');
    return res.data;
  },

  async createInvestment(planId, amount) {
    const res = await api.post('/investments/invest', {
      planId,
      amount,
    });
    return res.data;
  },

  async getMyInvestments() {
    const res = await api.get('/investments/my-investments');
    return res.data;
  },

  async getInvestmentById(id) {
    const res = await api.get(`/investments/${id}`);
    return res.data;
  },

  async stopInvestment(id) {
    const res = await api.post(`/investments/${id}/stop`);
    return res.data;
  },
};
