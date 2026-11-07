import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../api/client';
import { getCurrentUser, loginUser, registerUser } from '../api/auth';
import { MOCK_USER } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendOnline: boolean;
  isMockMode: boolean;
  apiUrl: string;
  login: (email: string, pass: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  toggleMockMode: (val: boolean) => void;
  updateApiUrl: (url: string) => void;
  checkHealth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isMockMode, setIsMockMode] = useState<boolean>(api.getMockMode());
  const [apiUrl, setApiUrlState] = useState<string>(api.getBaseUrl());

  const checkHealth = useCallback(async (): Promise<boolean> => {
    const online = await api.checkBackendHealth();
    setIsBackendOnline(online);
    return online;
  }, []);

  const loadUser = useCallback(async () => {
    const token = api.getToken();
    if (!token && !isMockMode) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (err) {
      console.warn('Failed to fetch user:', err);
      if (!isMockMode) {
        api.setToken(null);
        setUser(null);
      } else {
        setUser(MOCK_USER);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isMockMode]);

  useEffect(() => {
    checkHealth();
    loadUser();
  }, [checkHealth, loadUser]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await loginUser(email, pass);
      await loadUser();
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      if (isBackendOnline && !isMockMode) {
        // Try live backend with seed credentials
        try {
          await loginUser('demo@metermind.ai', 'metermind123');
          await loadUser();
          return;
        } catch {
          console.warn('Live demo login failed, falling back to mock mode demo session.');
        }
      }
      // If backend is not available or mock mode is on:
      api.setMockMode(true);
      setIsMockMode(true);
      api.setToken('mock_demo_jwt_token_991823');
      setUser(MOCK_USER);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      await registerUser(name, email, pass);
      await loadUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const toggleMockMode = (val: boolean) => {
    api.setMockMode(val);
    setIsMockMode(val);
    if (val && !user) {
      setUser(MOCK_USER);
    }
  };

  const updateApiUrl = (url: string) => {
    api.setBaseUrl(url);
    setApiUrlState(url);
    checkHealth();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isBackendOnline,
    isMockMode,
    apiUrl,
    login,
    loginDemo,
    register,
    logout,
    toggleMockMode,
    updateApiUrl,
    checkHealth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
