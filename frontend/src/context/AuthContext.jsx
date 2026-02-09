import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API}/auth/me`);
        setUser(response.data);
        
        // Get subscription info
        const subResponse = await axios.get(`${API}/subscriptions/current`);
        setSubscription(subResponse.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = useCallback(async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { access_token, user: userData } = response.data;
    
    localStorage.setItem('auth_token', access_token);
    setToken(access_token);
    setUser(userData);
    
    // Get subscription info
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const subResponse = await axios.get(`${API}/subscriptions/current`);
    setSubscription(subResponse.data);
    
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await axios.post(`${API}/auth/register`, { name, email, password });
    const { access_token, user: userData } = response.data;
    
    localStorage.setItem('auth_token', access_token);
    setToken(access_token);
    setUser(userData);
    
    // Get subscription info
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const subResponse = await axios.get(`${API}/subscriptions/current`);
    setSubscription(subResponse.data);
    
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('chat_session_id');
    setToken(null);
    setUser(null);
    setSubscription(null);
  }, []);

  const refreshSubscription = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API}/subscriptions/current`);
      setSubscription(response.data);
      
      // Also refresh user data
      const userResponse = await axios.get(`${API}/auth/me`);
      setUser(userResponse.data);
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    }
  }, [token]);

  const subscribe = useCallback(async (planId) => {
    const response = await axios.post(`${API}/subscriptions/subscribe`, { plan_id: planId });
    await refreshSubscription();
    return response.data;
  }, [refreshSubscription]);

  const cancelSubscription = useCallback(async () => {
    const response = await axios.post(`${API}/subscriptions/cancel`);
    await refreshSubscription();
    return response.data;
  }, [refreshSubscription]);

  const value = {
    user,
    token,
    loading,
    subscription,
    login,
    register,
    logout,
    subscribe,
    cancelSubscription,
    refreshSubscription,
    isAuthenticated: !!user,
    isPremium: user?.subscription_plan === 'standard' || user?.subscription_plan === 'premium',
    isFullDrama: user?.subscription_plan === 'premium'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
