'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowRight, Plus, Minus, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { productService } from '@/services/product.service';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';
import Link from 'next/link';
import { wishlistService } from '@/services/wishlist.service';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const PLACEHOLDER_IMG = '/placeholder-product.svg';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProduct(slug as string);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      toast.success(`${product.title} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Please sign in to add items to your cart.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await wishlistService.addProduct(product._id);
      toast.success('Added to wishlist!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Please sign in to use your wishlist.');
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className={`flex-grow flex flex-col md:flex-row w-full bg-[#fbf9f5] ${outfit.className}`}>
        <section className="w-full md:w-1/2 md:h-[calc(100vh-80px)] p-10">
          <Skeleton className="w-full h-full rounded-none bg-[#efeeea]" />
        </section>
        <section className="w-full md:w-1/2 p-10 space-y-8 max-w-xl mx-auto md:mx-0">
           <Skeleton className="h-4 w-24 bg-[#efeeea] rounded-none" />
           <Skeleton className="h-16 w-3/4 bg-[#efeeea] rounded-none" />
           <Skeleton className="h-6 w-1/4 bg-[#efeeea] rounded-none" />
           <Skeleton className="h-32 w-full bg-[#efeeea] rounded-none" />
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-[#fbf9f5] ${outfit.className}`}>
        <div className="text-center">
          <h2 className={`${playfair.className} text-3xl mb-4 text-black`}>Product not found</h2>
          <Link href="/products" className="inline-block bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#474746] transition-colors mt-4">
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.imageCover, ...(product.images || [])].filter(Boolean);
  if (allImages.length === 0) allImages.push(PLACEHOLDER_IMG);

  return (
    <div className={`flex-grow flex flex-col md:flex-row w-full bg-[#fbf9f5] text-[#1b1c1a] ${outfit.className}`}>
      
      {/* Left: Sticky Vertical Gallery */}
      <section className="w-full md:w-1/2 md:h-[calc(100vh-80px)] md:sticky md:top-[80px] overflow-y-auto hidden-scrollbar flex flex-col bg-[#efeeea]" style={{ scrollbarWidth: 'none' }}>
        {allImages.map((img, idx) => (
          <div key={idx} className="aspect-[3/4] md:aspect-auto md:h-[calc(100vh-80px)] w-full relative shrink-0">
            <Image
              src={img}
              alt={`${product.title} - Image ${idx + 1}`}
              fill
              unoptimized
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              priority={idx === 0}
            />
          </div>
        ))}
      </section>

      {/* Right: Independent Scrolling Details */}
      <section className="w-full md:w-1/2 px-5 md:px-20 py-12 md:py-24 flex flex-col md:min-h-[calc(100vh-80px)] overflow-y-auto hidden-scrollbar">
        <div className="max-w-xl mx-auto md:mx-0 w-full flex flex-col gap-8">
          
          {/* Breadcrumbs & Meta */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium text-[#444748]">
            <Link href="/products" className="hover:text-black transition-colors">ARCHIVE</Link>
            <span>/</span>
            <Link href={`/categories`} className="hover:text-black transition-colors">{product.category?.name?.toUpperCase() || 'COLLECTION'}</Link>
          </div>

          {/* Title & Price */}
          <div className="flex flex-col gap-4">
            <h1 className={`${playfair.className} text-4xl md:text-6xl text-black leading-[1.1] tracking-tighter`}>
              {product.title}
            </h1>
            <p className="text-lg text-[#444748]">${product.price.toFixed(2)} USD</p>
          </div>

          {/* Description */}
          <div className="text-base text-[#1b1c1a] leading-relaxed mt-2 font-light">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selection */}
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748]">QUANTITY</span>
            <div className="flex items-center border border-[#c4c7c7] w-fit">
               <button 
                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 disabled={quantity <= 1}
                 className="p-3 hover:bg-[#efeeea] transition-colors disabled:opacity-50 text-black"
               >
                 <Minus className="h-4 w-4" />
               </button>
               <span className="w-12 text-center text-sm font-medium">{quantity}</span>
               <button 
                 onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                 disabled={quantity >= product.quantity}
                 className="p-3 hover:bg-[#efeeea] transition-colors disabled:opacity-50 text-black"
               >
                 <Plus className="h-4 w-4" />
               </button>
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748] mt-2">
              {product.quantity > 0 ? `${product.quantity} IN STOCK` : 'OUT OF STOCK'}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="flex-1 bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.15em] font-medium py-5 hover:bg-opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <span>ADD TO BAG</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="w-[60px] border border-[#1A1A1A] text-black hover:bg-[#efeeea] transition-all flex justify-center items-center"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[13px] text-center text-[#444748]">Complimentary worldwide shipping.</p>

          {/* Accordions */}
          <div className="mt-12 flex flex-col border-t border-[#c4c7c7]/30">
            {/* Accordion Item 1 */}
            <div className="border-b border-[#c4c7c7]/30">
              <button 
                className="w-full py-6 flex justify-between items-center group outline-none" 
                onClick={() => toggleAccordion('details')}
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium text-black group-hover:opacity-70 transition-opacity">DETAILS & CARE</span>
                <span className={`text-black group-hover:opacity-70 transition-transform duration-300 ${openAccordion === 'details' ? 'rotate-180' : ''}`}>
                  {openAccordion === 'details' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <div 
                className="grid transition-all duration-400 ease-out"
                style={{ gridTemplateRows: openAccordion === 'details' ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 text-base text-[#444748] leading-relaxed font-light">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Ratings: {product.ratingsAverage} / 5 ({product.ratingsQuantity} reviews)</li>
                      <li>Category: {product.category?.name}</li>
                      <li>Handle with care. Store in the provided dust bag away from direct sunlight.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Item 2 */}
            <div className="border-b border-[#c4c7c7]/30">
              <button 
                className="w-full py-6 flex justify-between items-center group outline-none" 
                onClick={() => toggleAccordion('materials')}
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium text-black group-hover:opacity-70 transition-opacity">MATERIALS & ORIGIN</span>
                <span className={`text-black group-hover:opacity-70 transition-transform duration-300 ${openAccordion === 'materials' ? 'rotate-180' : ''}`}>
                   {openAccordion === 'materials' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <div 
                className="grid transition-all duration-400 ease-out"
                style={{ gridTemplateRows: openAccordion === 'materials' ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 text-base text-[#444748] leading-relaxed font-light">
                    <p>Sourced from heritage suppliers to ensure a natural aging process that develops a unique patina over time. Hardware is solid brass with a custom matte finish.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion Item 3 */}
            <div className="border-b border-[#c4c7c7]/30">
              <button 
                className="w-full py-6 flex justify-between items-center group outline-none" 
                onClick={() => toggleAccordion('shipping')}
              >
                <span className="text-xs uppercase tracking-[0.15em] font-medium text-black group-hover:opacity-70 transition-opacity">SHIPPING & RETURNS</span>
                <span className={`text-black group-hover:opacity-70 transition-transform duration-300 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}>
                   {openAccordion === 'shipping' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <div 
                className="grid transition-all duration-400 ease-out"
                style={{ gridTemplateRows: openAccordion === 'shipping' ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 text-base text-[#444748] leading-relaxed font-light">
                    <p>We offer complimentary express shipping on all orders. Returns are accepted within 14 days of delivery, provided the item is unused and in its original packaging. Please view our full policy for exclusions.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Add a global style for hidden scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
