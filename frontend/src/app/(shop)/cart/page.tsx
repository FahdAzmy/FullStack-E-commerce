'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    discountedTotal,
    isLoading,
    loadCart,
    updateQuantity,
    removeItem,
    applyCoupon,
  } = useCartStore();
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    loadCart().catch((error: any) => {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Unable to load cart.');
      }
    });
  }, [loadCart]);

  const handleUpdateQuantity = async (id: string, newQty: number, stock: number) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      toast.error(`Only ${stock} items in stock`);
      return;
    }
    try {
      await updateQuantity(id, newQty);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update quantity.');
    }
  };

  const handleRemoveItem = async (id: string, name: string) => {
    try {
      await removeItem(id);
      toast.success(`${name} removed from cart`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to remove item.');
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      await applyCoupon(coupon.trim());
      toast.success('Coupon applied');
      setCoupon('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired coupon.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Your cart is empty</h2>
        <p className="mt-3 max-w-md text-lg text-gray-500">
          Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
        </p>
        <Link href="/products" className="mt-10">
          <Button size="lg" className="h-14 px-10 text-lg font-bold">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <Link href="/products" className="text-sm font-semibold text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden border-none shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative aspect-square w-full sm:w-48 overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Link href={`/products/${item.productId}`} className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">In Stock: {item.stock}</p>
                      </div>
                      <p className="text-xl font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border bg-gray-50 p-1 shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1, item.stock)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold"
                        onClick={() => handleRemoveItem(item.cartItemId, item.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24 border-none shadow-xl bg-gray-50/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Standard Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value)}
                    placeholder="Coupon code"
                    className="pl-9"
                  />
                </div>
                <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isLoading}>
                  Apply
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-primary">${(discountedTotal ?? totalPrice).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Link href="/checkout" className="w-full">
                <Button className="h-14 w-full text-lg font-bold shadow-lg shadow-primary/20">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-center text-xs text-gray-500">
                Secure checkout powered by Stripe. All taxes and shipping are calculated at checkout.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
