import { User } from '../context/userContext';
import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const createUser = async (data: CreateUserPayload): Promise<APIResponse<User>> => {
  const response = await api.post('/users/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<APIResponse<User>> => {
  const response = await api.post('/users/auth/login', data);
  return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/');
  return response.data;
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await api.patch<User>(`/users/${user._id}`, user);
  return response.data;
};

export const updateConfig = async (config: User['configuration']) => {
  const response = await api.patch<User>(`/users/config/`, config);
  return response.data;
};

export const getCurrentUser = async (): Promise<APIResponse<User>> => {
  const response = await api.get<APIResponse<User>>('/users/me', {
    withCredentials: true,
  });
  return response.data;
};