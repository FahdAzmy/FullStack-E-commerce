'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, Package, Settings, ShoppingBag, User as UserIcon, MapPin } from 'lucide-react';
import { Outfit, Playfair_Display } from 'next/font/google';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const navLinks = [
  { href: '/#curated', label: 'Curation', active: (pathname: string) => pathname === '/' },
  { href: '/products', label: 'Archive', active: (pathname: string) => pathname.startsWith('/products') },
  { href: '/categories', label: 'Atelier', active: (pathname: string) => pathname === '/categories' },
  { href: '/#about', label: 'About', active: () => false },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems, loadCart } = useCartStore();

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  useEffect(() => {
    if (isAuthenticated) {
      loadCart().catch(() => undefined);
    }
  }, [isAuthenticated, loadCart]);

  if (isAuthPage) return null;

  return (
    <nav
      className={`sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#c4c7c7]/30 bg-[#fbf9f5]/70 px-5 py-4 text-black backdrop-blur-xl transition-all duration-300 md:px-20 ${outfit.className}`}
    >
      <div className="hidden flex-1 items-center gap-8 md:flex">
        {navLinks.map((item) => {
          const isActive = item.active(pathname);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'text-[12px] font-medium uppercase leading-none tracking-[0.15em] transition-colors duration-300 hover:text-black',
                isActive ? 'border-b border-black pb-1 text-black' : 'text-[#444748]'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-1 justify-start md:flex-none md:justify-center">
        <Link
          href="/"
          className={`${playfair.className} text-[40px] font-normal leading-none tracking-normal text-black transition-opacity duration-200 hover:opacity-70 md:text-[52px]`}
        >
          VESTIGE
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 text-black">
        <Link
          href="/cart"
          aria-label="Shopping bag"
          className="relative flex items-center justify-center p-2 transition-opacity duration-300 hover:opacity-70"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
          {totalItems > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-none bg-black p-0 text-[9px] text-white">
              {totalItems}
            </Badge>
          )}
        </Link>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account"
                className="hidden items-center justify-center p-2 transition-opacity duration-300 hover:opacity-70 md:flex"
              >
                <UserIcon className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none border-[#c4c7c7]/30 bg-[#fbf9f5] shadow-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-[#444748]">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#c4c7c7]/30" />
              <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-[#efeeea]">
                <Link href="/account/profile">
                  <UserIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-[#efeeea]">
                <Link href="/account/orders">
                  <Package className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  <span>My Orders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-[#efeeea]">
                <Link href="/account/addresses">
                  <MapPin className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  <span>Addresses</span>
                </Link>
              </DropdownMenuItem>
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-[#efeeea]">
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4" strokeWidth={1.5} />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-[#c4c7c7]/30" />
              <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-none text-red-600 focus:bg-red-50 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            aria-label="Account"
            className="hidden items-center justify-center p-2 transition-opacity duration-300 hover:opacity-70 md:flex"
          >
            <UserIcon className="h-5 w-5" strokeWidth={1.4} />
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Menu"
              className="flex items-center justify-center p-2 transition-opacity duration-300 hover:opacity-70 md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-none border-[#c4c7c7]/30 bg-[#fbf9f5]">
            {navLinks.map((item) => (
              <DropdownMenuItem key={item.label} asChild className="cursor-pointer rounded-none focus:bg-[#efeeea]">
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-[#c4c7c7]/30" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-[#efeeea]">
              <Link href={isAuthenticated ? '/account/profile' : '/login'}>Account</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
