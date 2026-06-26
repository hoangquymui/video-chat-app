import { api } from "./axios";
import type { LoginData, LoginResponse } from "../types/auth.type";

export const loginApi = async (data: LoginData) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
