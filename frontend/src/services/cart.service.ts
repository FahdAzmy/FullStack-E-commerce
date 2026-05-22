import api from './api';

export interface CartProduct {
  _id: string;
  title: string;
  price: number;
  imageCover?: string;
  quantity?: number;
}

export interface ServerCartItem {
  _id: string;
  product: CartProduct | string;
  quantity: number;
  color?: string;
  price: number;
}

export interface ServerCart {
  _id: string;
  cartItems: ServerCartItem[];
  totalCartPrice?: number;
  totalPriceAfterDiscount?: number;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get<{ data: ServerCart }>('/cart');
    return response.data;
  },

  addProduct: async (productId: string, color?: string) => {
    const response = await api.post<{ data: ServerCart }>('/cart', { productId, color });
    return response.data;
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const response = await api.put<{ data: ServerCart }>(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeProduct: async (itemId: string) => {
    const response = await api.delete<{ data: ServerCart }>(`/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    await api.delete('/cart');
  },

  applyCoupon: async (coupon: string) => {
    const response = await api.put<{ data: ServerCart }>('/cart/applyCoupon', { coupon });
    return response.data;
  },
};
