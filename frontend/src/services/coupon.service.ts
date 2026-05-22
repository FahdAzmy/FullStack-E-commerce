import api from './api';

export const couponService = {
  getCoupons: async () => {
    const response = await api.get('/copon');
    return response.data;
  },

  createCoupon: async (data: { name: string; expire: string; discount: number }) => {
    const response = await api.post('/copon', data);
    return response.data;
  },

  updateCoupon: async (id: string, data: Partial<{ name: string; expire: string; discount: number }>) => {
    const response = await api.put(`/copon/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (id: string) => {
    await api.delete(`/copon/${id}`);
  },
};
