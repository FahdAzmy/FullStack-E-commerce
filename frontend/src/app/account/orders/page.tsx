'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { orderService } from '@/services/order.service';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders({ limit: 50 })
      .then((response) => setOrders(response.data ?? []))
      .catch((error: any) => toast.error(error.response?.data?.message || 'Unable to load orders.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className={`w-full flex flex-col gap-8 ${outfit.className}`}>
      <header className="hidden md:flex justify-between items-end mb-4">
        <div>
          <h2 className={`${playfair.className} text-2xl text-black`}>Order Archive</h2>
          <p className="text-base text-[#444748] mt-1 font-light">Review your past acquisitions.</p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {!isLoading && orders.length > 0 ? (
          orders.map((order) => {
            const firstItem = order.cartItems?.[0];
            const itemImage = firstItem?.product?.imageCover || '/placeholder-product.svg';
            const itemTitle = firstItem?.product?.title || 'Archive Piece';
            const date = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            
            return (
              <article key={order._id} className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center border border-[#c4c7c7]/20 hover:border-[#c4c7c7]/50 transition-colors shadow-sm">
                <div className="w-full sm:w-32 h-32 bg-[#efeeea] flex-shrink-0 relative overflow-hidden">
                  <Image src={itemImage} alt={itemTitle} fill unoptimized className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }} />
                </div>
                
                <div className="flex-grow flex flex-col justify-between h-full py-1 w-full">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748]">Order #{order._id.slice(-6).toUpperCase()}</span>
                      <span className="text-[13px] text-[#444748]">{date}</span>
                    </div>
                    <h3 className={`${playfair.className} text-xl text-black mt-1`}>{itemTitle}</h3>
                    {order.cartItems?.length > 1 && (
                      <p className="text-xs text-[#444748] mt-1">+ {order.cartItems.length - 1} other items</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-[#536251]' : 'bg-[#c46b5a]'}`}></span>
                      <span className={`text-[13px] ${order.isDelivered ? 'text-[#536251]' : 'text-[#c46b5a]'}`}>
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </div>
                    <Link href={`/account/orders/${order._id}`} className="text-[11px] uppercase tracking-[0.15em] font-medium text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity">
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="border border-[#c4c7c7]/30 bg-white py-20 text-center flex flex-col items-center shadow-sm">
             <div className="w-16 h-16 bg-[#efeeea] rounded-full flex items-center justify-center mb-6">
                <Package className="h-6 w-6 text-[#444748]" />
             </div>
             <h3 className={`${playfair.className} text-xl text-black`}>{isLoading ? 'Loading archive...' : 'Your archive is empty'}</h3>
             <p className="mt-2 text-[#444748] text-sm font-light">Acquisitions will appear here.</p>
             <Link href="/products" className="mt-8 bg-black text-white text-[11px] uppercase tracking-[0.15em] font-medium px-8 py-4 hover:bg-[#474746] transition-colors">
               Explore Atelier
             </Link>
          </div>
        )}
      </div>
    </section>
  );
}
