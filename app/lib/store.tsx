"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MarketItem, UserProfile } from "./types";
import { MOCK_ITEMS } from "./mock-data";

const LS_USER = "prodance_user";
const LS_ITEMS = "prodance_user_items";

interface StoreContextValue {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;

  allItems: MarketItem[];
  userItems: MarketItem[];
  addItem: (item: MarketItem) => void;
  deleteItem: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userItems, setUserItems] = useState<MarketItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LS_USER);
      if (savedUser) setUser(JSON.parse(savedUser));
      const savedItems = localStorage.getItem(LS_ITEMS);
      if (savedItems) setUserItems(JSON.parse(savedItems));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      localStorage.setItem(LS_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_USER);
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_ITEMS, JSON.stringify(userItems));
  }, [userItems, hydrated]);

  const login = useCallback((profile: UserProfile) => setUser(profile), []);
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LS_USER);
  }, []);
  const updateProfile = useCallback(
    (profile: UserProfile) => setUser(profile),
    [],
  );

  const addItem = useCallback((item: MarketItem) => {
    setUserItems((prev) => [item, ...prev]);
  }, []);

  const deleteItem = useCallback((id: string) => {
    setUserItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const allItems = [...userItems, ...MOCK_ITEMS];

  if (!hydrated) return null;

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        allItems,
        userItems,
        addItem,
        deleteItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
