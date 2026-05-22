'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { addressService, AddressInput } from '@/services/address.service';
import { Playfair_Display, Outfit } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const initialAddress: AddressInput = {
  alies: '',
  details: '',
  phone: '',
  city: '',
  postalCode: '',
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState<AddressInput>(initialAddress);
  const [isLoading, setIsLoading] = useState(false);

  const loadAddresses = async () => {
    const response = await addressService.getAddresses();
    setAddresses(response.data ?? []);
  };

  useEffect(() => {
    loadAddresses().catch((error: any) => {
      toast.error(error.response?.data?.message || 'Unable to load addresses.');
    });
  }, []);

  const updateField = (field: keyof AddressInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await addressService.addAddress(form);
      setAddresses(response.data ?? []);
      setForm(initialAddress);
      toast.success('Address added.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to add address.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      const response = await addressService.removeAddress(addressId);
      setAddresses(response.data ?? []);
      toast.success('Address removed.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to remove address.');
    }
  };

  const InputField = ({ label, value, field }: { label: string, value: string, field: keyof AddressInput }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#444748]">
        {label}
      </label>
      <input 
        type="text" 
        required 
        value={value}
        onChange={(e) => updateField(field, e.target.value)}
        className="border-b border-[#c4c7c7]/50 bg-transparent pb-2 text-black focus:outline-none focus:border-black transition-colors text-sm" 
      />
    </div>
  );

  return (
    <section className={`w-full flex flex-col gap-8 ${outfit.className}`}>
      <header className="hidden md:flex justify-between items-end mb-4">
        <div>
          <h2 className={`${playfair.className} text-2xl text-black`}>Saved Addresses</h2>
          <p className="text-base text-[#444748] mt-1 font-light">Manage your shipping destinations.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Add Address Form */}
        <div>
          <h3 className={`${playfair.className} text-xl text-black mb-6`}>Add New Address</h3>
          <form onSubmit={addAddress} className="space-y-6">
            <InputField label="Address Label (e.g. Home)" value={form.alies} field="alies" />
            <InputField label="Street Address" value={form.details} field="details" />
            <div className="grid grid-cols-2 gap-4">
               <InputField label="City" value={form.city} field="city" />
               <InputField label="Postal Code" value={form.postalCode || ''} field="postalCode" />
            </div>
            <InputField label="Phone Number" value={form.phone} field="phone" />
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 bg-black text-white text-[11px] uppercase tracking-[0.15em] font-medium px-8 py-4 hover:bg-[#474746] transition-colors disabled:opacity-50 w-full"
            >
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        </div>

        {/* Existing Addresses */}
        <div className="flex flex-col gap-4">
          <h3 className={`${playfair.className} text-xl text-black mb-2 lg:mb-6`}>Your Addresses</h3>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <article key={address._id} className="bg-white p-6 border border-[#c4c7c7]/20 shadow-sm flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-black mb-1">{address.alies || 'Address'}</span>
                  <p className="text-sm text-[#444748]">{address.details}</p>
                  <p className="text-sm text-[#444748]">{address.city}, {address.postalCode}</p>
                  <p className="text-sm text-[#444748] mt-2 font-medium">{address.phone}</p>
                </div>
                <button 
                  onClick={() => removeAddress(address._id)}
                  className="text-[10px] uppercase tracking-wider text-[#c46b5a] hover:opacity-70 transition-opacity border-b border-[#c46b5a] pb-0.5"
                >
                  Remove
                </button>
              </article>
            ))
          ) : (
            <div className="border border-[#c4c7c7]/30 bg-[#efeeea] py-12 text-center shadow-sm">
               <p className="text-[#444748] text-sm font-light">No saved addresses yet.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
