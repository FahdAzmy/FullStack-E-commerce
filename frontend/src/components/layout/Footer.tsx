import Link from 'next/link';
import { Outfit, Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const Footer = () => {
  return (
    <footer
      className={`flex w-full flex-col items-start justify-between gap-6 border-t border-[#c4c7c7]/30 bg-[#fbf9f5] px-5 py-8 text-[#444748] md:flex-row md:items-center md:px-20 ${outfit.className}`}
    >
      <Link href="/" className={`${playfair.className} text-[24px] font-normal leading-[1.4] text-black`}>
        VESTIGE
      </Link>

      <div className="flex flex-wrap gap-4 text-[12px] font-medium uppercase leading-none tracking-[0.15em] md:gap-6">
        <Link href="/privacy" className="underline transition-colors hover:text-black">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline transition-colors hover:text-black">
          Terms of Service
        </Link>
        <Link href="/shipping" className="underline transition-colors hover:text-black">
          Shipping &amp; Returns
        </Link>
        <Link href="/#about" className="underline transition-colors hover:text-black">
          Contact
        </Link>
      </div>

      <p className="text-[12px] font-light uppercase leading-[1.6] tracking-normal">
        &copy; {new Date().getFullYear()} VESTIGE EDITORIAL. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};

export default Footer;
