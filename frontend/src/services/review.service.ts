import api from './api';

export const reviewService = {
  getReviews: async (params?: Record<string, unknown>) => {
    const response = await api.get('/review', { params });
    return response.data;
  },

  getProductReviews: async (productId: string) => {
    const response = await api.get(`/product/${productId}/review`);
    return response.data;
  },

  createReview: async (data: { product: string; ratings: number; title: string }) => {
    const response = await api.post('/review', data);
    return response.data;
  },

  updateReview: async (id: string, data: { ratings?: number; title?: string }) => {
    const response = await api.put(`/review/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string) => {
    await api.delete(`/review/${id}`);
  },
};
