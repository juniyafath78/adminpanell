import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

export const fetchHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export const fetchFeedbackList = async (params = {}) => {
  const { data } = await api.get('/feedback', { params });
  return data;
};

export const createFeedback = async (payload) => {
  const { data } = await api.post('/feedback', payload);
  return data;
};

export const updateFeedback = async (id, payload) => {
  const { data } = await api.put(`/feedback/${id}`, payload);
  return data;
};

export const deleteFeedback = async (id) => {
  const { data } = await api.delete(`/feedback/${id}`);
  return data;
};

export const seedSampleFeedback = async () => {
  const { data } = await api.post('/feedback/seed');
  return data;
};

export default api;
