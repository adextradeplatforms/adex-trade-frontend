import api from './api';

const getPlans = async () => {
  const response = await api.get('/investments/plans');
  return response.data.data;
};

const createInvestment = async (planId, amount) => {
  const response = await api.post('/investments/invest', {
    planId,
    amount,
  });
  return response.data.data;
};

const getMyInvestments = async () => {
  const response = await api.get('/investments/my-investments');
  return response.data.data;
};

const getInvestmentById = async (investmentId) => {
  const response = await api.get(`/investments/${investmentId}`);
  return response.data.data;
};

const stopInvestment = async (investmentId) => {
  const response = await api.post(`/investments/${investmentId}/stop`);
  return response.data.data;
};

export const investmentService = {
  getPlans,
  createInvestment,
  getMyInvestments,
  getInvestmentById,
  stopInvestment,
};
