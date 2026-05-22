import api from './api';

export interface AddressInput {
  alies: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export const addressService = {
  getAddresses: async () => {
    const response = await api.get('/address');
    return response.data;
  },

  addAddress: async (data: AddressInput) => {
    const response = await api.post('/address', data);
    return response.data;
  },

  removeAddress: async (addressId: string) => {
    const response = await api.delete(`/address/${addressId}`);
    return response.data;
  },
};
