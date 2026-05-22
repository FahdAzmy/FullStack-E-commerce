import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  addProduct: async (productId: string) => {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  },

  removeProduct: async (productId: string) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },
};
