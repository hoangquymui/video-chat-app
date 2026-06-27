import { api } from "./axios";
import type { CreateUserData, UpdateUserData, User } from "../types/user.type";

export const getUsersApi = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const getChatUsersApi = async () => {
  const response = await api.get<User[]>("/users/chat");
  return response.data;
};

export const createUserApi = async (data: CreateUserData) => {
  const response = await api.post<User>("/users", data);
  return response.data;
};

export const updateUserApi = async (id: number, data: UpdateUserData) => {
  const response = await api.patch<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUserApi = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
