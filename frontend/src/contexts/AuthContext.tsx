import { createContext, useEffect, useState, type ReactNode } from "react";
import { loginApi } from "../api/auth.api";
import type { LoginData } from "../types/auth.type";
import type { User } from "../types/user.type";

export type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userRaw = localStorage.getItem("user");

    setAccessToken(token);
    setUser(userRaw ? JSON.parse(userRaw) : null);
  }, []);

  const login = async (data: LoginData) => {
    const response = await loginApi(data);

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("user", JSON.stringify(response.user));

    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn: Boolean(accessToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
