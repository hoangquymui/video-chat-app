import { api } from "./axios";

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export const loginApi = async (data: LoginData) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
