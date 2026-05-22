'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { wishlistService } from '@/services/wishlist.service';
import { useCartStore } from '@/store/cart.store';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await wishlistService.getWishlist();
      setProducts(response.data ?? []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to load curation.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeProduct = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await wishlistService.removeProduct(productId);
      setProducts((current) => current.filter((product) => product._id !== productId));
      toast.success('Piece removed from curation.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to remove piece.');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    try {
      await addItem(product, 1);
      toast.success('Added to bag.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to add to bag.');
    }
  };

  if (!isLoading && products.length === 0) {
    return (
      <div className={`min-h-[70vh] bg-[#fbf9f5] flex flex-col items-center justify-center px-6 py-20 text-center ${outfit.className}`}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#efeeea] mb-8">
          <Heart className="h-8 w-8 text-[#444748]" />
        </div>
        <h1 className={`${playfair.className} text-4xl text-black`}>Your Curation is empty</h1>
        <p className="mt-4 max-w-md text-[#444748] font-light">Reserve pieces you want to revisit or acquire later.</p>
        <Link href="/products" className="mt-10 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium px-10 py-4 hover:bg-[#474746] transition-colors">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#fbf9f5] flex-grow flex flex-col ${outfit.className}`}>
      {/* Curation Header */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-12 px-6 md:px-20">
        <h1 className={`${playfair.className} text-4xl md:text-5xl text-black text-center tracking-tighter`}>Your Curation</h1>
        <p className="text-base text-[#444748] mt-4 text-center max-w-2xl font-light">
          A carefully selected collection of pieces reserved for your consideration.
        </p>
      </section>

      {/* Grid */}
      <section className="w-full px-6 md:px-20 pb-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse flex flex-col">
                  <div className="aspect-[3/4] bg-[#efeeea] mb-6 w-full"></div>
                  <div className="h-5 bg-[#e4e2de] w-2/3 mx-auto mb-3"></div>
                  <div className="h-4 bg-[#e4e2de] w-1/4 mx-auto mb-6"></div>
                </div>
              ))
            : products.map((product) => {
                const imgSrc = product.imageCover || '/placeholder-product.svg';
                
                return (
                  <div key={product._id} className="group cursor-pointer flex flex-col">
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#efeeea]">
                      <Link href={`/products/${product._id}`}>
                        <Image
                          src={imgSrc}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <button 
                        onClick={(e) => removeProduct(e, product._id)}
                        aria-label="Remove from wishlist" 
                        className="absolute top-4 right-4 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#fbf9f5]/50 p-2 rounded-full backdrop-blur-sm hover:bg-[#fbf9f5]"
                      >
                        <Heart className="h-5 w-5 fill-black text-black" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col pt-6 items-center text-center px-4">
                      <Link href={`/products/${product._id}`}>
                        <h3 className={`${playfair.className} text-xl text-black`}>{product.title}</h3>
                      </Link>
                      <p className="text-sm text-[#444748] mt-2">${Number(product.price).toFixed(2)}</p>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="mt-6 text-[11px] uppercase tracking-[0.15em] font-medium text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </section>
    </div>
  );
}
