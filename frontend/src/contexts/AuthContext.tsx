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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken"),
  );

  useEffect(() => {
    const syncAuth = () => {
      setAccessToken(localStorage.getItem("accessToken"));
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
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
