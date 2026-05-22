import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', {
      ...credentials,
      passwordConfirm: credentials.confirmPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgotPassword', { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.put('/auth/resetPassword', data);
    return response.data;
  },

  verifyResetCode: async (resetCode: string) => {
    const response = await api.post('/auth/verifyResetCode', { resetCode });
    return response.data;
  },
};
