"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const TOKEN_KEY = "token";

export interface AuthUser {
  id: string;
  name: string;
  phone_number: string;
  city: string | null;
  telegram: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface RegisterData {
  name: string;
  phone_number: string;
  password: string;
  city?: string;
  telegram?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    fetchMe(saved)
      .then((userData) => {
        setToken(saved);
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, password }),
      });
    } catch {
      throw new Error(
        "Не удалось подключиться к серверу. Проверьте NEXT_PUBLIC_API_URL и что бэкенд запущен."
      );
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const detail = Array.isArray(payload.detail) ? payload.detail[0]?.msg : payload.detail;
      throw new Error(detail ?? "Ошибка входа");
    }
    const data = await res.json();
    const newToken: string = data.access_token;
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const userData = await fetchMe(newToken);
    setUser(userData);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error(
        "Не удалось подключиться к серверу. Проверьте NEXT_PUBLIC_API_URL и что бэкенд запущен."
      );
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const detail = Array.isArray(payload.detail) ? payload.detail[0]?.msg : payload.detail;
      throw new Error(detail ?? "Ошибка регистрации");
    }
    const tokenData = await res.json();
    const newToken: string = tokenData.access_token;
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const userData = await fetchMe(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
