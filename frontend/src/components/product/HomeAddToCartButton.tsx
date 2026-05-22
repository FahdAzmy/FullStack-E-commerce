'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart.store';

type HomeAddToCartProduct = {
  _id: string;
  title: string;
  price: number;
  imageCover?: string;
  quantity?: number;
};

export default function HomeAddToCartButton({ product }: { product: HomeAddToCartProduct }) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      await addItem(product, 1);
      toast.success(`${product.title} added to cart.`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Please sign in to add items to your cart.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding || product.quantity === 0}
      className="w-fit text-left text-[12px] font-medium uppercase leading-none tracking-[0.15em] text-black underline transition-colors hover:text-[#444748] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isAdding ? 'Adding' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
