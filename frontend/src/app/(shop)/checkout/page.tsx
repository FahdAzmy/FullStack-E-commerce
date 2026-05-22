'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { orderService } from '@/services/order.service';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Detailed address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, cartId, totalPrice, discountedTotal, loadCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('stripe');

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
    },
  });

  useEffect(() => {
    loadCart().catch((error: any) => {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Unable to load cart.');
      }
    });
  }, [loadCart]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (!cartId) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsLoading(true);
    try {
      const shippingAddress = {
        details: data.address,
        phone: data.phone,
        city: data.city,
        postalCode: data.postalCode,
      };

      if (paymentMethod === 'stripe') {
        const response = await orderService.createCheckoutSession(cartId, shippingAddress);
        const stripeUrl = response?.session?.url;
        if (!stripeUrl) throw new Error('No Stripe URL returned.');
        window.location.href = stripeUrl;
        return;
      }

      // Cash on delivery
      await orderService.createCashOrder(cartId, shippingAddress);
      toast.success('Order placed successfully!');
      await loadCart();
      router.push('/orders/confirmation');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to place order.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-[#fbf9f5] ${outfit.className}`}>
        <div className="text-center">
          <h2 className={`${playfair.className} text-3xl mb-4 text-black`}>Your cart is empty</h2>
          <Link href="/products" className="inline-block bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#474746] transition-colors mt-4">
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  const InputField = ({ name, placeholder, type = "text", colSpan = "1" }: { name: keyof CheckoutFormValues, placeholder: string, type?: string, colSpan?: string }) => (
    <div className={`relative ${colSpan === '2' ? 'md:col-span-2' : 'md:col-span-1'} pb-5`}>
      <input 
        type={type}
        id={name}
        placeholder={placeholder}
        className="peer w-full h-[56px] border border-[#c4c7c7]/50 rounded-none bg-transparent px-4 pt-4 pb-1 focus:outline-none focus:border-black transition-colors text-base placeholder-transparent"
        {...form.register(name)}
      />
      <label 
        htmlFor={name}
        className="absolute left-4 top-2 text-[11px] uppercase tracking-wider text-[#444748]/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#444748] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-black cursor-text"
      >
        {placeholder}
      </label>
      {form.formState.errors[name] && (
        <span className="text-red-500 text-xs absolute bottom-0 left-0">{form.formState.errors[name]?.message}</span>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#fbf9f5] text-[#1b1c1a] ${outfit.className} selection:bg-black selection:text-white`}>
      {/* Checkout Header (Minimal) */}
      <header className="w-full py-6 px-5 md:px-20 flex justify-between items-center border-b border-[#c4c7c7]/30 bg-[#fbf9f5]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className={`${playfair.className} text-3xl md:text-4xl tracking-tighter text-black hover:opacity-70 transition-opacity`}>
          MODERNSTORE
        </Link>
        <div className="flex items-center gap-2 text-[#444748]">
          <Lock className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.15em] font-medium hidden sm:inline-block">Secure Checkout</span>
        </div>
      </header>

      {/* Main Checkout Flow */}
      <main className="w-full max-w-[1440px] mx-auto px-5 md:px-20 py-12 flex flex-col lg:flex-row gap-10 lg:gap-[80px]">
        
        {/* LEFT COLUMN: Checkout Inputs */}
        <div className="w-full lg:w-3/5 lg:max-w-2xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-12 text-[#444748]">
            <span className={`text-xs uppercase tracking-[0.15em] font-medium ${step === 1 ? 'text-black' : ''}`}>Shipping</span>
            <ChevronRight className="h-4 w-4" />
            <span className={`text-xs uppercase tracking-[0.15em] font-medium ${step === 2 ? 'text-black' : ''}`}>Payment</span>
          </nav>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {step === 1 && (
              <>
                <section>
                  <div className="flex justify-between items-end mb-6">
                    <h2 className={`${playfair.className} text-2xl text-black`}>Contact</h2>
                    {!user && (
                      <Link href="/login" className="text-xs uppercase tracking-[0.15em] font-medium text-[#444748] hover:text-black underline underline-offset-4 transition-colors">
                        Log in
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField name="email" placeholder="Email Address" type="email" colSpan="1" />
                    <InputField name="phone" placeholder="Phone Number" colSpan="1" />
                  </div>
                </section>

                <section>
                  <h2 className={`${playfair.className} text-2xl text-black mb-6`}>Shipping address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <InputField name="country" placeholder="Country/Region" colSpan="2" />
                    <InputField name="fullName" placeholder="Full name" colSpan="2" />
                    <InputField name="address" placeholder="Address" colSpan="2" />
                    <InputField name="city" placeholder="City" colSpan="1" />
                    <InputField name="postalCode" placeholder="ZIP / Postal code" colSpan="1" />
                  </div>
                </section>
              </>
            )}

            {step === 2 && (
              <section className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className={`${playfair.className} text-2xl text-black mb-6`}>Payment Method</h2>
                <div className="flex flex-col gap-3">

                  {/* Stripe Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`border p-5 flex items-center justify-between transition-colors ${
                      paymentMethod === 'stripe' ? 'border-black' : 'border-[#c4c7c7]/50 hover:border-[#c4c7c7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'stripe' ? 'border-black' : 'border-[#c4c7c7]'
                      }`}>
                        {paymentMethod === 'stripe' && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                      <span className="font-medium text-black">Credit / Debit Card</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <span className="text-xs border border-[#c4c7c7] px-2 py-0.5 font-mono">VISA</span>
                      <span className="text-xs border border-[#c4c7c7] px-2 py-0.5 font-mono">MC</span>
                    </div>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`border p-5 flex items-center justify-between transition-colors ${
                      paymentMethod === 'cash' ? 'border-black' : 'border-[#c4c7c7]/50 hover:border-[#c4c7c7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cash' ? 'border-black' : 'border-[#c4c7c7]'
                      }`}>
                        {paymentMethod === 'cash' && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                      <span className="font-medium text-black">Cash on Delivery</span>
                    </div>
                  </button>

                  {paymentMethod === 'stripe' && (
                    <p className="text-xs text-[#444748] mt-2 pl-1">
                      You will be redirected to Stripe's secure payment page to complete your order.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-4">
              {step === 1 ? (
                <Link href="/cart" className="text-xs uppercase tracking-[0.15em] font-medium text-[#444748] hover:text-black flex items-center gap-1 transition-colors w-full md:w-auto justify-center md:justify-start">
                  <ChevronLeft className="h-4 w-4" /> Return to cart
                </Link>
              ) : (
                <button type="button" onClick={() => setStep(1)} className="text-xs uppercase tracking-[0.15em] font-medium text-[#444748] hover:text-black flex items-center gap-1 transition-colors w-full md:w-auto justify-center md:justify-start">
                  <ChevronLeft className="h-4 w-4" /> Back to shipping
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full md:w-auto bg-black text-white text-xs uppercase tracking-[0.15em] font-medium px-10 py-5 rounded-none hover:bg-[#474746] transition-colors disabled:opacity-50"
              >
                {isLoading
                  ? (paymentMethod === 'stripe' ? 'Redirecting to Stripe...' : 'Processing...')
                  : step === 1
                    ? 'Continue to payment'
                    : paymentMethod === 'stripe'
                      ? 'Pay with Card'
                      : 'Place Order'}
              </button>
            </div>
          </form>

          <hr className="border-[#c4c7c7]/20 my-10" />
          <footer className="flex flex-wrap items-center gap-6 text-[#444748]/70 border-t border-transparent pt-2">
            <Link href="#" className="text-[10px] uppercase tracking-wider hover:text-black transition-colors">Refund policy</Link>
            <Link href="#" className="text-[10px] uppercase tracking-wider hover:text-black transition-colors">Privacy policy</Link>
            <Link href="#" className="text-[10px] uppercase tracking-wider hover:text-black transition-colors">Terms of service</Link>
          </footer>
        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <div className="w-full lg:w-2/5 relative mt-10 lg:mt-0">
          <div className="sticky top-[120px] bg-[#efeeea] border border-[#c4c7c7]/20 p-8 rounded-none">
            <h3 className={`${playfair.className} text-2xl text-black mb-6 hidden lg:block`}>Order Summary</h3>
            
            {/* Cart Items List */}
            <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="relative w-[64px] h-[80px] bg-[#e4e2de] shrink-0 border border-[#c4c7c7]/20 overflow-hidden">
                    <Image 
                      src={item.image || '/placeholder-product.svg'} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h4 className="text-base font-medium text-black line-clamp-1">{item.name}</h4>
                    <p className="text-[13px] text-[#444748] mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-base text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 border-t border-[#c4c7c7]/20 pt-6 flex flex-col gap-3">
              <div className="flex justify-between items-center text-[#444748]">
                <span className="text-base">Subtotal</span>
                <span className="text-base text-black">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#444748]">
                <span className="text-base">Shipping</span>
                <span className="text-[13px]">Free</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="mt-4 border-t border-[#c4c7c7]/20 pt-4 flex justify-between items-end">
              <span className="text-base text-[#444748]">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] text-[#444748]">USD</span>
                <span className={`${playfair.className} text-3xl text-black`}>${(discountedTotal ?? totalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
