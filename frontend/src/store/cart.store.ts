'use client';

import { create } from 'zustand';
import { cartService, ServerCart } from '@/services/cart.service';

export interface CartItem {
  _id: string;
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  color?: string;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  totalItems: number;
  totalPrice: number;
  discountedTotal: number | null;
  isLoading: boolean;
  loadCart: () => Promise<void>;
  addItem: (product: any, quantity?: number, color?: string) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  applyCoupon: (coupon: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const emptyCart = {
  items: [],
  cartId: null,
  totalItems: 0,
  totalPrice: 0,
  discountedTotal: null,
};

const mapCart = (cart: ServerCart) => {
  const items = cart.cartItems
    .map((item) => {
      const product = typeof item.product === 'string' ? null : item.product;
      const productId = product?._id ?? String(item.product);

      return {
        _id: item._id,
        cartItemId: item._id,
        productId,
        name: product?.title ?? 'Product',
        price: item.price,
        image: product?.imageCover ?? '/placeholder-product.svg',
        quantity: item.quantity,
        stock: product?.quantity ?? 99,
        color: item.color,
      };
    })
    .filter((item) => item.productId);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice =
    cart.totalCartPrice ?? items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountedTotal = cart.totalPriceAfterDiscount ?? null;

  return {
    items,
    cartId: cart._id,
    totalItems,
    totalPrice,
    discountedTotal,
  };
};

export const useCartStore = create<CartState>()((set) => ({
  ...emptyCart,
  isLoading: false,

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartService.getCart();
      set({ ...mapCart(response.data), isLoading: false });
    } catch (error: any) {
      if (error.response?.status === 404) {
        set({ ...emptyCart, isLoading: false });
        return;
      }
      set({ isLoading: false });
      throw error;
    }
  },

  addItem: async (product, quantity = 1, color) => {
    set({ isLoading: true });
    let response = await cartService.addProduct(product._id, color);

    for (let index = 1; index < quantity; index += 1) {
      response = await cartService.addProduct(product._id, color);
    }

    set({ ...mapCart(response.data), isLoading: false });
  },

  removeItem: async (cartItemId) => {
    set({ isLoading: true });
    try {
      const response = await cartService.removeProduct(cartItemId);
      set({ ...mapCart(response.data), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    set({ isLoading: true });
    try {
      const response = await cartService.updateQuantity(cartItemId, quantity);
      set({ ...mapCart(response.data), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  applyCoupon: async (coupon) => {
    set({ isLoading: true });
    try {
      const response = await cartService.applyCoupon(coupon);
      set({ ...mapCart(response.data), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    await cartService.clearCart();
    set({ ...emptyCart, isLoading: false });
  },
}));
