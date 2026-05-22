export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  profileImg?: string;
}

export interface AuthResponse {
  data: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}
