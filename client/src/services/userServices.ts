import { User } from "../context/userContext";
import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export const login = async (data: LoginPayload): Promise<string> => {
  const response = await api.post<{ token: string }>('/auth/login', data);
  return response.data.token;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/');
  return response.data;
}

export const updateUser = async (user: User): Promise<User> => {
  const response = await api.patch<User>(`/users/${user._id}`, user);
  return response.data;
}

export const updateConfig = async (config: User['configuration']) => {
  const response = await api.patch<User>(`/users/config/`, config);
  return response.data;
}