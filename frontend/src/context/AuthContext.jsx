import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Token validation failed, clearing token", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('token', data.access_token);
    const userData = await fetchCurrentUser();
    setUser(userData);
    return userData;
  };

  const register = async (email, password, businessName) => {
    await registerUser(email, password, businessName);
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
