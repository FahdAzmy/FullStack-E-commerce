'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { productService } from '@/services/product.service';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .getCategories()
      .then((response) => setCategories(response.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-500">Browse products by department.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="aspect-square rounded-xl" />)
          : categories.map((category) => (
              <Link key={category._id} href={`/products?category=${category._id}`} className="group flex aspect-square flex-col items-center justify-center rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-lg">
                {category.image && <Image src={category.image} alt={category.name} width={92} height={92} className="mb-4 transition group-hover:scale-105" />}
                <span className="text-center font-semibold text-gray-900">{category.name}</span>
              </Link>
            ))}
      </div>
    </div>
  );
}
