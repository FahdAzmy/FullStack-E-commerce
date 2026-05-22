import api from './api';

export const userService = {
  getMe: async () => {
    const response = await api.get('/user/getMe');
    return response.data;
  },

  updateMe: async (data: { name?: string; email?: string; phone?: string }) => {
    const response = await api.put('/user/updateMe', data);
    return response.data;
  },

  changeMyPassword: async (data: { password: string; newPassword: string }) => {
    const response = await api.put('/user/changeMyPass', data);
    return response.data;
  },

  deleteLoggedUser: async () => {
    const response = await api.delete('/user/deleteLoggedUser');
    return response.data;
  },

  getUsers: async (params?: Record<string, unknown>) => {
    const response = await api.get('/user', { params });
    return response.data;
  },

  createUser: async (data: { name: string; email: string; password: string; passwordConfirm: string; role?: string }) => {
    const response = await api.post('/user', data);
    return response.data;
  },

  updateUser: async (id: string, data: { name?: string; email?: string; phone?: string; role?: string }) => {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/user/${id}`);
  },
};
