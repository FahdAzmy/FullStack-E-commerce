'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  LogOut,
  Package,
  Settings,
  LogIn,
  Search,
  Heart,
  MapPin,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

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
      className={`w-full top-0 sticky z-50 bg-[#fbf9f5]/80 backdrop-blur-xl border-b border-[#c4c7c7]/30 flex justify-between items-center px-5 md:px-20 py-4 transition-all duration-300 ${outfit.className}`}
    >
      {/* ── Left: Navigation Links (desktop only) ── */}
      <div className="hidden md:flex flex-1 gap-8 items-center text-xs uppercase tracking-[0.15em] font-medium">
        <Link
          href="/products"
          className={cn(
            'transition-colors hover:text-black duration-300',
            pathname.startsWith('/products')
              ? 'text-black border-b border-black pb-1'
              : 'text-[#444748]'
          )}
        >
          Archive
        </Link>
        <Link
          href="/categories"
          className={cn(
            'transition-colors hover:text-black duration-300',
            pathname === '/categories'
              ? 'text-black border-b border-black pb-1'
              : 'text-[#444748]'
          )}
        >
          Curation
        </Link>
      </div>

      {/* ── Center: Brand Logo ── */}
      <div className="flex-1 md:flex-none flex justify-start md:justify-center">
        <Link
          href="/"
          className={`${playfair.className} text-3xl md:text-4xl tracking-tighter text-black hover:opacity-70 transition-opacity duration-200`}
        >
          MODERNSTORE
        </Link>
      </div>

      {/* ── Right: Icon Actions ── */}
      {/* Order: Search | Wishlist | Cart | User/Login | (mobile) Menu */}
      <div className="flex flex-1 justify-end gap-0.5 md:gap-1 items-center text-black">

        {/* Search — desktop only */}
        <Link
          href="/search"
          aria-label="Search"
          className="hidden md:flex hover:opacity-70 transition-opacity duration-300 items-center justify-center p-2"
        >
          <Search className="h-5 w-5 stroke-[1.5]" />
        </Link>

        {/* Wishlist — always visible, filled when active */}
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="hover:opacity-70 transition-opacity duration-300 flex items-center justify-center p-2"
        >
          <Heart
            className={cn(
              'h-5 w-5 stroke-[1.5] transition-all duration-200',
              pathname === '/wishlist' ? 'fill-black' : ''
            )}
          />
        </Link>

        {/* Shopping Bag with item count badge */}
        <Link
          href="/cart"
          aria-label="Shopping bag"
          className="relative hover:opacity-70 transition-opacity duration-300 flex items-center justify-center p-2"
        >
          <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
          {totalItems > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[9px] bg-black text-white border-none rounded-full">
              {totalItems}
            </Badge>
          )}
        </Link>

        {/* User dropdown (authenticated) or Sign-In icon */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account"
                className="hover:opacity-70 transition-opacity duration-300 flex items-center justify-center p-2 cursor-pointer outline-none"
              >
                <UserIcon className="h-5 w-5 stroke-[1.5]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#fbf9f5] border-[#c4c7c7]/30 rounded-none shadow-xl"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-[#444748]">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#c4c7c7]/30" />

              <DropdownMenuItem asChild className="rounded-none focus:bg-[#efeeea] cursor-pointer">
                <Link href="/account/profile">
                  <UserIcon className="mr-2 h-4 w-4 stroke-[1.5]" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-none focus:bg-[#efeeea] cursor-pointer">
                <Link href="/account/orders">
                  <Package className="mr-2 h-4 w-4 stroke-[1.5]" />
                  <span>My Orders</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-none focus:bg-[#efeeea] cursor-pointer">
                <Link href="/account/addresses">
                  <MapPin className="mr-2 h-4 w-4 stroke-[1.5]" />
                  <span>Addresses</span>
                </Link>
              </DropdownMenuItem>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <DropdownMenuItem asChild className="rounded-none focus:bg-[#efeeea] cursor-pointer">
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4 stroke-[1.5]" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-[#c4c7c7]/30" />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-none cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 stroke-[1.5]" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            aria-label="Sign in"
            className="hover:opacity-70 transition-opacity duration-300 flex items-center justify-center p-2"
          >
            <LogIn className="h-5 w-5 stroke-[1.5]" />
          </Link>
        )}

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          className="md:hidden hover:opacity-70 transition-opacity duration-300 flex items-center justify-center p-2"
        >
          <Menu className="h-5 w-5 stroke-[1.5]" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
