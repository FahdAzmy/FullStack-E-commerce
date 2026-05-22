'use client';

import { useAuthStore } from '@/store/auth.store';
import { Playfair_Display, Outfit } from 'next/font/google';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <section className={`w-full flex flex-col gap-8 ${outfit.className}`}>
      <header className="hidden md:flex justify-between items-end mb-4">
        <div>
          <h2 className={`${playfair.className} text-2xl text-black`}>Profile Details</h2>
          <p className="text-base text-[#444748] mt-1 font-light">Manage your personal information.</p>
        </div>
      </header>

      <div className="bg-white p-8 border border-[#c4c7c7]/20 shadow-sm flex flex-col md:flex-row gap-12">
        {/* Avatar Area */}
        <div className="flex flex-col items-center text-center w-full md:w-1/3">
           <div className="w-32 h-32 rounded-full bg-[#efeeea] flex items-center justify-center mb-6 overflow-hidden">
             {user.profileImg ? (
               <img src={user.profileImg} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <span className={`${playfair.className} text-4xl text-black`}>{user.name.charAt(0).toUpperCase()}</span>
             )}
           </div>
           <h3 className={`${playfair.className} text-xl text-black`}>{user.name}</h3>
           <p className="text-sm text-[#444748] mt-1">{user.email}</p>
           <span className="mt-4 px-3 py-1 bg-[#efeeea] text-[10px] uppercase tracking-wider text-black font-medium">{user.role}</span>
        </div>

        {/* Details Area */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748] flex items-center gap-2">
                  <User className="h-3 w-3" /> Full Name
                </label>
                <input type="text" disabled value={user.name} className="border-b border-[#c4c7c7]/50 bg-transparent pb-2 text-black focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748] flex items-center gap-2">
                  <Mail className="h-3 w-3" /> Email Address
                </label>
                <input type="email" disabled value={user.email} className="border-b border-[#c4c7c7]/50 bg-transparent pb-2 text-black focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748] flex items-center gap-2">
                  <Shield className="h-3 w-3" /> Account Role
                </label>
                <input type="text" disabled value={user.role} className="border-b border-[#c4c7c7]/50 bg-transparent pb-2 text-black focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748] flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Member Since
                </label>
                <input type="text" disabled value="December 2025" className="border-b border-[#c4c7c7]/50 bg-transparent pb-2 text-black focus:outline-none" />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
