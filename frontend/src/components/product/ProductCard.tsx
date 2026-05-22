'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const PLACEHOLDER_IMG = '/placeholder-product.svg';

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imgSrc, setImgSrc] = useState(product.imageCover || PLACEHOLDER_IMG);

  return (
    <Link href={`/products/${product._id}`} className={`group block relative cursor-pointer ${outfit.className}`}>
      <div className="aspect-[3/4] w-full bg-[#efeeea] mb-6 overflow-hidden relative">
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          unoptimized
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgSrc(PLACEHOLDER_IMG)}
        />
      </div>
      <div className="flex flex-col items-center text-center px-4">
        <span className="text-[11px] uppercase tracking-[0.15em] text-[#444748] mb-1 font-medium">
          {product.category?.name || 'Curated'}
        </span>
        <h3 className={`${playfair.className} text-xl text-black mb-2 transition-colors`}>
          {product.title}
        </h3>
        <span className="text-sm text-[#444748]">${Number(product.price).toFixed(2)}</span>
      </div>
    </Link>
  );
};

export default ProductCard;
