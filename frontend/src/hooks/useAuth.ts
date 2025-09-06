import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { authAPI } from '@/lib/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await authAPI.register(email, password, name, role);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};