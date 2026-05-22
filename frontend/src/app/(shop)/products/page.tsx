'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import ProductCard from '@/components/product/ProductCard';
import { Playfair_Display, Outfit } from 'next/font/google';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catsRes = await productService.getCategories();
        setCategories(catsRes.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          keyword: searchTerm,
          price: { gte: priceRange[0], lte: priceRange[1] },
        };
        
        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(',');
        }

        const res = await productService.getProducts(params);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategories, priceRange, searchParams]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
  };

  return (
    <div className={`min-h-screen bg-[#fbf9f5] flex-grow flex flex-col ${outfit.className}`}>
      {/* Page Header */}
      <section className="w-full px-6 md:px-20 pt-16 pb-12 max-w-[1600px] mx-auto text-center">
        <h1 className={`${playfair.className} text-4xl md:text-5xl text-black mb-4`}>The Collection</h1>
        <p className="text-base text-[#444748] max-w-2xl mx-auto font-light">
          Discover our curated selection of foundational pieces, designed with meticulous attention to form and material.
        </p>
      </section>

      {/* Sticky Filter Bar */}
      <section className="w-full sticky top-[73px] md:top-[85px] z-40 bg-[#fbf9f5]/90 backdrop-blur-md border-y border-[#c4c7c7]/30 py-3 mb-12 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-20 flex justify-between items-center">
          
          {/* Filters Group */}
          <div className="flex items-center gap-4 py-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748] mr-2 hidden md:block">Filter:</span>
            
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#444748]" />
               <input
                 placeholder="Search archive..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9 pr-4 py-1.5 rounded-full border border-[#c4c7c7] bg-transparent text-[11px] uppercase tracking-wider text-black focus:border-black focus:outline-none transition-colors"
               />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-[#c4c7c7] hover:border-black transition-colors text-black text-[11px] uppercase tracking-[0.15em] font-medium whitespace-nowrap cursor-pointer">
                  Refine {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#fbf9f5] border-r border-[#c4c7c7]/30 p-8 sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className={`${playfair.className} text-2xl text-black`}>Refine Collection</SheetTitle>
                </SheetHeader>
                <div className="mt-12 space-y-12">
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-black mb-6">Categories</h3>
                    <div className="space-y-4">
                      {categories.map((cat: any) => (
                        <div key={cat._id} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`mob-${cat._id}`} 
                            checked={selectedCategories.includes(cat._id)}
                            onCheckedChange={() => toggleCategory(cat._id)}
                            className="border-[#c4c7c7] data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                          <label htmlFor={`mob-${cat._id}`} className="text-sm font-medium text-[#444748] cursor-pointer">
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-black mb-6">Price Range</h3>
                    <Slider
                      defaultValue={[0, 5000]}
                      max={5000}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-[#444748]">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  <button onClick={clearFilters} className="w-full mt-8 bg-transparent border border-black text-black py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-colors">
                    Clear All
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sort Group */}
          <div className="flex items-center ml-4 flex-shrink-0">
             <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-black">
               {products.length} Pieces
             </span>
          </div>

        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full px-6 md:px-20 pb-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-[80px]">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#efeeea] mb-6 w-full"></div>
                <div className="h-3 bg-[#e4e2de] w-1/3 mx-auto mb-3"></div>
                <div className="h-5 bg-[#e4e2de] w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-[#e4e2de] w-1/4 mx-auto"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center flex flex-col items-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#efeeea] mb-6">
                <Search className="h-6 w-6 text-[#444748]" />
              </div>
              <h3 className={`${playfair.className} mt-4 text-2xl text-black`}>No pieces found</h3>
              <p className="mt-2 text-[#444748] font-light">Try adjusting your curation filters to discover more.</p>
              <button onClick={clearFilters} className="mt-8 text-[11px] uppercase tracking-[0.15em] font-bold text-black border-b border-black pb-1 hover:opacity-70 transition-opacity">
                Clear all filters
              </button>
            </div>
          )}
        </div>
        
        {!isLoading && products.length > 0 && (
          <div className="mt-20 flex justify-center">
             <button className="bg-black text-white px-12 py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#474746] transition-colors duration-300">
                 DISCOVER MORE
             </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
