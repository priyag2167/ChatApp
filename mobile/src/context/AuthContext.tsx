import React, { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';
import { chatApi } from '../api/chat';
import { connectSocket, getSocket } from '../api/socket';

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  status?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, number: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.user || null);
          setToken(parsed.token || null);
          api.setToken(parsed.token || null);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Manage socket lifecycle based on auth token
  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      try { getSocket()?.removeAllListeners?.(); } catch {}
      try { getSocket()?.disconnect?.(); } catch {}
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await chatApi.login(email, password);
    setUser(data.user);
    setToken(data.token);
    api.setToken(data.token);
    await AsyncStorage.setItem('auth', JSON.stringify(data));
  }, []);

  const register = useCallback(async (name: string, email: string, number: string, password: string) => {
    const data = await chatApi.register(name.trim(), email.trim(), String(number).trim(), password);
    setUser(data.user);
    setToken(data.token);
    api.setToken(data.token);
    await AsyncStorage.setItem('auth', JSON.stringify(data));
  }, []);

  const logout = useCallback(async () => {
    try { getSocket()?.removeAllListeners?.(); } catch {}
    try { getSocket()?.disconnect?.(); } catch {}
    setUser(null);
    setToken(null);
    api.setToken(null);
    await AsyncStorage.removeItem('auth');
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, token, isLoading, login, register, logout }), [user, token, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

