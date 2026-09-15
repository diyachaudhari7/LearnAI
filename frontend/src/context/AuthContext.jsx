import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('learnai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('learnai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('learnai_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('learnai_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('learnai_token', access_token);
    localStorage.setItem('learnai_user', JSON.stringify(userData));
    return userData;
  };

  const loginAsDemo = async () => {
    return await login('demo@example.com', 'Demo@123');
  };

  const signup = async (name, email, password, role = 'Student') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('learnai_token', access_token);
    localStorage.setItem('learnai_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    try {
      api.post('/auth/logout').catch(() => {});
    } catch (e) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('learnai_token');
    localStorage.removeItem('learnai_user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('learnai_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        loginAsDemo,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
