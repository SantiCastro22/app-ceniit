import api from './api';

export const reservationService = {
  getAll: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  create: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  update: async (id, status) => {
    const response = await api.put(`/reservations/${id}`, { status });
    return response.data;
  }
};