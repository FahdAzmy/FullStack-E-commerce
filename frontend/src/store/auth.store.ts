import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  profileImg?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        Cookies.set('token', token, { expires: 7 }); // expires in 7 days
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
