'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { Playfair_Display, Outfit } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.data, response.token);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fbf9f5] text-[#1b1c1a] antialiased flex ${outfit.className}`}>
      
      {/* Left Side: High Fashion Lifestyle Image (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#e4e2de] overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="High fashion editorial photography" 
          fill 
          className="object-cover object-center grayscale-[0.2] contrast-[0.9]"
          unoptimized
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-[#fbf9f5]/10 backdrop-blur-[2px]"></div>
        
        {/* Brand Mark (anchored to bottom left) */}
        <div className="absolute bottom-20 left-20 z-10 text-white">
          <Link href="/">
            <span className={`${playfair.className} text-6xl tracking-tighter mix-blend-difference opacity-80 hover:opacity-100 transition-opacity`}>MODERNSTORE</span>
          </Link>
        </div>
      </div>

      {/* Right Side: Login Canvas */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-20 py-24 bg-[#fbf9f5] min-h-screen relative">
        
        {/* Mobile Brand (Visible only on mobile) */}
        <div className="lg:hidden absolute top-8 left-6">
          <Link href="/">
            <span className={`${playfair.className} text-2xl tracking-tighter text-black`}>MODERNSTORE</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] mx-auto">
          
          {/* Header Section */}
          <div className="mb-12 text-center lg:text-left">
            <h1 className={`${playfair.className} text-4xl lg:text-5xl text-black mb-4`}>Welcome back.</h1>
            <p className="text-lg text-[#444748]">Sign in to access your curated archive and exclusive editorials.</p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
            
            {/* Email Input */}
            <div className="relative mt-4 group">
              <input 
                id="email" 
                type="email" 
                placeholder=" "
                className="peer block w-full appearance-none bg-transparent border-0 border-b border-[#c4c7c7] py-4 px-0 text-lg text-black focus:ring-0 focus:border-black transition-colors focus:outline-none"
                {...form.register('email')}
              />
              <label 
                htmlFor="email" 
                className="absolute top-4 left-0 text-lg text-[#444748] transition-all duration-300 origin-left cursor-text peer-focus:text-black peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 -translate-y-6 scale-[0.85]"
              >
                Email Address
              </label>
              {form.formState.errors.email && (
                <span className="text-red-500 text-xs absolute -bottom-5 left-0">{form.formState.errors.email.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="relative mt-6 group">
              <input 
                id="password" 
                type="password" 
                placeholder=" "
                className="peer block w-full appearance-none bg-transparent border-0 border-b border-[#c4c7c7] py-4 px-0 text-lg text-black focus:ring-0 focus:border-black transition-colors focus:outline-none"
                {...form.register('password')}
              />
              <label 
                htmlFor="password" 
                className="absolute top-4 left-0 text-lg text-[#444748] transition-all duration-300 origin-left cursor-text peer-focus:text-black peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 -translate-y-6 scale-[0.85]"
              >
                Password
              </label>
              <Link href="/forgot-password" className="absolute right-0 top-4 text-[#444748] hover:text-black transition-colors">
                <span className="text-[12px] uppercase tracking-[0.15em] font-medium">Forgot?</span>
              </Link>
              {form.formState.errors.password && (
                <span className="text-red-500 text-xs absolute -bottom-5 left-0">{form.formState.errors.password.message}</span>
              )}
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-8 w-full bg-[#1A1A1A] text-white py-[18px] px-6 text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Tertiary Action */}
          <div className="mt-20 text-center lg:text-left">
            <p className="text-base text-[#444748] inline-block mr-4">Don't have an account?</p>
            <Link href="/register" className="text-[12px] uppercase tracking-[0.15em] font-medium text-black relative inline-block group pb-1">
              CREATE ACCOUNT
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
