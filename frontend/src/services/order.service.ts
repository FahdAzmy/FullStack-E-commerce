import api from './api';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export const orderService = {
  getOrders: async (params?: Record<string, unknown>) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createCashOrder: async (cartId: string, shippingAddress: ShippingAddress) => {
    const response = await api.post(`/orders/${cartId}`, { shippingAddress });
    return response.data;
  },

  createCheckoutSession: async (cartId: string, shippingAddress: ShippingAddress) => {
    const response = await api.post(`/orders/chekout-session/${cartId}`, { shippingAddress });
    return response.data;
  },

  markPaid: async (id: string) => {
    const response = await api.put(`/orders/${id}/pay`);
    return response.data;
  },

  markDelivered: async (id: string) => {
    const response = await api.put(`/orders/${id}/dilvered`);
    return response.data;
  },
};
