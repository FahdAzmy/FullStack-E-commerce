'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { productService } from '@/services/product.service';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProducts({ keyword: query, limit: 20 });
        setProducts(response.data ?? []);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Search results</h1>
        <p className="mt-2 text-gray-500">{query ? `Showing matches for "${query}"` : 'Search from the navigation bar to find products.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-square rounded-xl" />)
        ) : products.length > 0 ? (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <div className="col-span-full py-20 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-bold">No products found</h2>
            <p className="mt-2 text-gray-500">Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
