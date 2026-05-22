import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Outfit, Playfair_Display } from 'next/font/google';
import HomeAddToCartButton from '@/components/product/HomeAddToCartButton';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD9eMFQ2Omv433aDzu14gpWIHtPmtuoILk0rx7r8dvPm_Tpt5YfhcPOuFWgUiIBjPOFKTXQj8YnNofPFsFixRnZLdwxrpGOYI8wzag_sGvPnk9rUXkrAxgD4o9n086zUshYrJfItckhu3eqocELfE3fgvoO57HUmNpTKytNc8HkHXkzIkwmaa-wSZWCTfOWnPn3gax4yKfrxVq-bHLm88Mn9eaPda1uyNqkuWbuWywCR0ZP6AJT5UTOBmBQlCi1oV6lZS3rgnrluL0';

type HomeProduct = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  priceAfterDiscount?: number;
  quantity?: number;
  imageCover?: string;
  category?: {
    name?: string;
  };
};

type ProductResponse = {
  data?: HomeProduct[];
};

async function getCuratedProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return [];
  }

  const query = new URLSearchParams({
    limit: '3',
    sort: '-ratingsAverage,-createdAt',
  });

  try {
    const response = await fetch(`${baseUrl}/product?${query.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ProductResponse;
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

function productHref(product: HomeProduct) {
  return `/products/${product._id}`;
}

function formatPrice(product: HomeProduct) {
  const price = product.priceAfterDiscount ?? product.price;
  return `$${Number(price || 0).toFixed(0)}`;
}

function categoryLabel(product: HomeProduct, fallback: string) {
  return product.category?.name || fallback;
}

function productImage(product: HomeProduct) {
  return product.imageCover || '/placeholder-product.svg';
}

export default async function HomePage() {
  const curatedProducts = await getCuratedProducts();
  const [feature, sideFeature, wideFeature] = curatedProducts;

  return (
    <div className={`flex flex-col overflow-hidden bg-[#fbf9f5] text-[#1b1c1a] ${outfit.className}`}>
      <section className="relative flex h-[870px] w-full items-center justify-center overflow-hidden bg-[#efeeea] md:h-screen">
        <Image
          src={HERO_IMAGE}
          alt="A sunlit minimalist living space with curved architecture and sculptural furniture."
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-90 mix-blend-multiply transition-transform duration-[1200ms] ease-out hover:scale-[1.02]"
        />

        <div className="relative z-10 flex flex-col items-center px-5 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1
            className={`${playfair.className} mb-8 max-w-4xl text-[40px] leading-[1.2] text-black drop-shadow-sm md:text-[64px] md:leading-[1.1]`}
          >
            The Art of Living
          </h1>
          <p className="mb-8 hidden max-w-xl text-[18px] font-light leading-[1.6] text-[#444748] md:block">
            A curated selection of objects and garments designed for deliberate existence. Elevate your surroundings
            with uncompromising craftsmanship.
          </p>
          <Link
            href="#curated"
            className="inline-flex items-center justify-center bg-black px-8 py-4 text-[12px] font-medium uppercase leading-none tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#474746]"
          >
            Discover Collection
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-5 w-5 text-black/50" strokeWidth={1.5} />
        </div>
      </section>

      <section id="curated" className="bg-[#fbf9f5] px-5 py-[120px] md:px-20">
        <div className="mb-12 text-center md:mb-[120px] md:text-left">
          <h2 className={`${playfair.className} mb-2 text-[32px] font-normal leading-[1.3] text-black`}>
            Curated For You
          </h2>
          <p className="text-[16px] font-light leading-[1.6] text-[#444748]">
            Objects of permanence, selected for the discerning.
          </p>
        </div>

        {curatedProducts.length === 0 ? (
          <div className="mx-auto max-w-xl py-24 text-center">
            <h3 className={`${playfair.className} text-2xl text-black`}>No curated products yet</h3>
            <p className="mt-3 text-[#444748]">
              The homepage is connected to the backend. Add products there and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-[80px] md:grid-cols-12 md:gap-y-[160px]">
            {feature && (
              <article className="group col-span-1 flex flex-col md:col-span-7">
                <Link href={productHref(feature)} className="block">
                  <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden bg-[#efeeea] md:aspect-[4/5]">
                    <Image
                      src={productImage(feature)}
                      alt={feature.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col md:pr-[20%]">
                    <span className="mb-2 text-[12px] font-medium uppercase leading-none tracking-[0.15em] text-[#747878]">
                      {categoryLabel(feature, 'Atelier Edition')}
                    </span>
                    <h3
                      className={`${playfair.className} mb-1 text-[24px] font-normal leading-[1.4] text-black transition-opacity group-hover:opacity-70`}
                    >
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="mb-4 line-clamp-2 text-[16px] font-light leading-[1.6] text-[#444748]">
                        {feature.description}
                      </p>
                    )}
                    <span className="text-[16px] font-light leading-[1.6] text-black">{formatPrice(feature)}</span>
                  </div>
                </Link>
              </article>
            )}

            {sideFeature && (
              <article className="group col-span-1 flex flex-col md:col-span-4 md:col-start-9 md:mt-[240px]">
                <Link href={productHref(sideFeature)} className="block">
                  <div className="relative mb-4 aspect-square w-full overflow-hidden bg-[#efeeea]">
                    <Image
                      src={productImage(sideFeature)}
                      alt={sideFeature.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3
                    className={`${playfair.className} mb-1 text-[24px] font-normal leading-[1.4] text-black transition-opacity group-hover:opacity-70`}
                  >
                    {sideFeature.title}
                  </h3>
                  <span className="mb-2 block text-[16px] font-light leading-[1.6] text-black">
                    {formatPrice(sideFeature)}
                  </span>
                </Link>
                <HomeAddToCartButton product={sideFeature} />
              </article>
            )}

            {wideFeature && (
              <article className="group col-span-1 flex flex-col md:col-span-10 md:col-start-2">
                <Link href={productHref(wideFeature)} className="block">
                  <div className="relative mb-8 aspect-video w-full overflow-hidden bg-[#efeeea] md:aspect-[21/9]">
                    <Image
                      src={productImage(wideFeature)}
                      alt={wideFeature.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                      <span className="mb-2 block text-[12px] font-medium uppercase leading-none tracking-[0.15em] text-[#747878]">
                        {categoryLabel(wideFeature, 'The Study')}
                      </span>
                      <h3 className={`${playfair.className} mb-2 text-[24px] font-normal leading-[1.4] text-black`}>
                        {wideFeature.title}
                      </h3>
                      {wideFeature.description && (
                        <p className="line-clamp-2 text-[16px] font-light leading-[1.6] text-[#444748]">
                          {wideFeature.description}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 border border-black px-6 py-3 text-[12px] font-medium uppercase leading-none tracking-[0.15em] text-black transition-colors hover:bg-[#e4e2de]">
                      Explore Edit
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
