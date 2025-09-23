import api from '../utils/api';
import type { IUser } from '../types/user';
import type { IOrder } from '../types/order';

export interface IUpdateProfileRequest {
  userName: string;
  phone: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IUploadAvatarRequest {
  avatar: File;
}

export const userService = {
  // Lấy thông tin profile
  getProfile: async (): Promise<IUser> => {
    const response = await api.get('/user/profile');
    return response.data;
  },


  updateProfile: async (data: IUpdateProfileRequest): Promise<IUser> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },


  changePassword: async (data: IChangePasswordRequest): Promise<void> => {
    await api.put('/user/change-password', data);
  },


  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/user/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Lấy lịch sử đơn hàng của user
  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    orders: IOrder[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> => {
    const response = await api.get('/user/orders', { params });
    return response.data;
  },
};