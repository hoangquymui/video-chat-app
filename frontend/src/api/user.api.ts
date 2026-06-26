import { api } from "./axios";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export const getUsersApi = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};
