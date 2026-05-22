'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { productService } from '@/services/product.service';
import { Playfair_Display, Outfit } from 'next/font/google';
import { Skeleton } from '@/components/ui/skeleton';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await productService.getProducts({ limit: 4, sort: '-ratingsAverage' });
        setFeaturedProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`flex flex-col bg-[#fbf9f5] text-black ${outfit.className} overflow-hidden`}>
      {/* Hero Section */}
      <section className="relative w-full h-[870px] md:h-screen flex items-center justify-center bg-[#efeeea] overflow-hidden">
        {/* Background Image from Design */}
        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9eMFQ2Omv433aDzu14gpWIHtPmtuoILk0rx7r8dvPm_Tpt5YfhcPOuFWgUiIBjPOFKTXQj8YnNofPFsFixRnZLdwxrpGOYI8wzag_sGvPnk9rUXkrAxgD4o9n086zUshYrJfItckhu3eqocELfE3fgvoO57HUmNpTKytNc8HkHXkzIkwmaa-wSZWCTfOWnPn3gax4yKfrxVq-bHLm88Mn9eaPda1uyNqkuWbuWywCR0ZP6AJT5UTOBmBQlCi1oV6lZS3rgnrluL0" 
          alt="Minimalist living space" 
          fill
          unoptimized
          className="object-cover object-center opacity-90 mix-blend-multiply transition-transform duration-[800ms] hover:scale-105"
          priority
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className={`${playfair.className} text-5xl md:text-7xl lg:text-[80px] text-black max-w-4xl mb-8 drop-shadow-sm tracking-tight`}>
            The Art of Living
          </h1>
          <p className="text-lg md:text-xl text-[#444748] max-w-xl mb-10 hidden md:block font-light">
            A curated selection of objects and garments designed for deliberate existence. Elevate your surroundings with uncompromising craftsmanship.
          </p>
          <Link 
            href="#curated" 
            className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#474746] transition-colors duration-300"
          >
            Discover Collection
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-black/50 h-8 w-8" />
        </div>
      </section>

      {/* Curated For You Section (Asymmetrical Masonry) */}
      <section className="py-24 md:py-32 px-5 md:px-20 bg-[#fbf9f5]" id="curated">
        <div className="mb-12 md:mb-32 text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className={`${playfair.className} text-3xl md:text-5xl text-black mb-4`}>Curated For You</h2>
          <p className="text-[#444748] text-lg font-light">Objects of permanence, selected for the discerning.</p>
        </div>

        {/* Desktop Grid Layout (12 col), Mobile Stack */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-[80px] md:gap-y-[160px] gap-x-6">
          
          {isLoading ? (
            <div className="col-span-1 md:col-span-12 flex justify-center py-20">
              <Skeleton className="h-[400px] w-full max-w-2xl bg-gray-200" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              {/* Editorial Feature 1: Large Left */}
              <article className="col-span-1 md:col-span-7 flex flex-col group cursor-pointer animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
                <Link href={`/products/${featuredProducts[0]._id}`}>
                  <div className="w-full bg-[#efeeea] aspect-[3/4] md:aspect-[4/5] overflow-hidden mb-6 relative">
                    <Image 
                      src={featuredProducts[0].imageCover || '/placeholder-product.svg'} 
                      alt={featuredProducts[0].title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col md:pr-[20%]">
                    <span className="text-xs uppercase tracking-[0.15em] font-medium text-[#747878] mb-2">{featuredProducts[0].category?.name || 'Edition'}</span>
                    <h3 className={`${playfair.className} text-2xl md:text-3xl text-black mb-2 group-hover:opacity-70 transition-opacity`}>
                      {featuredProducts[0].title}
                    </h3>
                    <p className="text-[#444748] font-light mb-4 line-clamp-2">
                      {featuredProducts[0].description}
                    </p>
                    <span className="text-lg text-black font-light">${featuredProducts[0].price}</span>
                  </div>
                </Link>
              </article>

              {/* Editorial Feature 2: Smaller Right, Offset Down */}
              {featuredProducts[1] && (
                <article className="col-span-1 md:col-span-4 md:col-start-9 md:mt-[240px] flex flex-col group cursor-pointer animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                  <Link href={`/products/${featuredProducts[1]._id}`}>
                    <div className="w-full bg-[#efeeea] aspect-square overflow-hidden mb-6 relative">
                      <Image 
                        src={featuredProducts[1].imageCover || '/placeholder-product.svg'} 
                        alt={featuredProducts[1].title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`${playfair.className} text-2xl text-black mb-2 group-hover:opacity-70 transition-opacity`}>
                        {featuredProducts[1].title}
                      </h3>
                      <span className="text-lg text-black font-light mb-4">${featuredProducts[1].price}</span>
                      <span className="text-left text-xs uppercase tracking-[0.15em] font-medium text-black underline hover:text-[#444748] transition-colors w-fit">
                        Discover
                      </span>
                    </div>
                  </Link>
                </article>
              )}

              {/* Editorial Feature 3: Wide Center Panel */}
              {featuredProducts[2] && (
                <article className="col-span-1 md:col-span-10 md:col-start-2 flex flex-col group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                  <Link href={`/products/${featuredProducts[2]._id}`}>
                    <div className="w-full bg-[#efeeea] aspect-video md:aspect-[21/9] overflow-hidden mb-8 relative">
                      <Image 
                        src={featuredProducts[2].imageCover || '/placeholder-product.svg'} 
                        alt={featuredProducts[2].title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="max-w-2xl">
                        <span className="text-xs uppercase tracking-[0.15em] font-medium text-[#747878] mb-2 block">
                          The Collection
                        </span>
                        <h3 className={`${playfair.className} text-2xl md:text-3xl text-black mb-2 group-hover:opacity-70 transition-opacity`}>
                          {featuredProducts[2].title}
                        </h3>
                        <p className="text-[#444748] font-light line-clamp-2">
                          {featuredProducts[2].description}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 border border-black text-black px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#e4e2de] transition-colors shrink-0">
                        Explore Edit
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </article>
              )}
            </>
          ) : (
            <div className="col-span-12 text-center py-20 text-[#444748]">
              No featured products available at the moment.
            </div>
          )}

        </div>
      </section>
      
      {/* View All Products CTA */}
      <section className="bg-[#efeeea] py-24 flex justify-center items-center">
         <Link 
            href="/products" 
            className="inline-flex items-center justify-center bg-transparent border border-black text-black px-10 py-5 text-sm uppercase tracking-[0.15em] font-medium hover:bg-black hover:text-white transition-colors duration-300"
          >
            View Entire Archive
          </Link>
      </section>
    </div>
  );
}
