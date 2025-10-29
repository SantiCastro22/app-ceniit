import api from './api';

export const resourceService = {
  getAll: async () => {
    const response = await api.get('/resources');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  create: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },

  update: async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};