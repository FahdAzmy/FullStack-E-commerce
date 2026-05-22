import api from './api';

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get('/product', { params });
    return response.data;
  },

  getProduct: async (idOrSlug: string) => {
    const response = await api.get(`/product/${idOrSlug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  createProduct: async (data: FormData) => {
    const response = await api.post('/product', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProduct: async (id: string, data: Record<string, unknown> | FormData) => {
    const response = await api.put(`/product/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/product/${id}`);
  },
};
