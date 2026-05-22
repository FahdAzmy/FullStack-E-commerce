'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Profile Details', href: '/account/profile' },
    { name: 'Order History', href: '/account/orders' },
    { name: 'Saved Addresses', href: '/account/addresses' },
  ];

  return (
    <div className={`min-h-screen bg-[#fbf9f5] text-[#1b1c1a] ${outfit.className} pb-20`}>
      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar / Concierge Navigation (Desktop) */}
        <aside className="hidden md:flex flex-col w-1/4 pr-8 border-r border-[#c4c7c7]/30 h-fit">
          <h1 className={`${playfair.className} text-3xl mb-8 text-black`}>Your Atelier</h1>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.15em] py-2 w-fit transition-colors ${
                    isActive 
                      ? 'text-black font-bold border-b border-black pb-1' 
                      : 'text-[#444748] hover:text-black border-b border-transparent pb-1'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="text-[11px] uppercase tracking-[0.15em] text-[#444748] hover:text-black transition-colors py-2 w-fit mt-8 border-b border-transparent pb-1"
            >
              Sign Out
            </Link>
          </nav>
        </aside>

        {/* Mobile Header & Tabs */}
        <div className="md:hidden w-full mb-8">
          <h1 className={`${playfair.className} text-3xl mb-6 text-black text-center`}>Your Atelier</h1>
          <div className="flex justify-center gap-4 overflow-x-auto pb-2 border-b border-[#c4c7c7]/30" style={{ scrollbarWidth: 'none' }}>
            {navLinks.map((link) => {
               const isActive = pathname.startsWith(link.href);
               return (
                 <Link
                   key={link.name}
                   href={link.href}
                   className={`text-[10px] uppercase tracking-[0.15em] whitespace-nowrap px-2 pb-1 ${
                     isActive ? 'text-black border-b border-black font-bold' : 'text-[#444748]'
                   }`}
                 >
                   {link.name.split(' ')[0]} {/* Shorten for mobile */}
                 </Link>
               );
            })}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="w-full md:w-3/4 md:pl-8">
          {children}
        </div>
      </main>
    </div>
  );
}
