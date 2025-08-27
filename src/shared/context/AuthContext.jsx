import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5303';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data);
          setPermissions(data.permissions || []);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        // Auth check failed, user is not authenticated
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        setPermissions(data.permissions || []);
        setIsAuthenticated(true);
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    // Let the calling component handle navigation
  };

  // Permission checking functions
  const hasPermission = (resource, action) => {
    if (!permissions || permissions.length === 0) return false;
    
    // Admin has all permissions
    if (user?.role === 'admin' || (user?.user_role && user.user_role.name === 'admin')) {
      return true;
    }
    
    const permissionKey = `${resource}:${action}`;
    return permissions.includes(permissionKey);
  };

  const hasAnyPermission = (permissionList) => {
    if (!permissions || permissions.length === 0) return false;
    
    // Admin has all permissions
    if (user?.role === 'admin' || (user?.user_role && user.user_role.name === 'admin')) {
      return true;
    }
    
    return permissionList.some(permission => permissions.includes(permission));
  };

  const canRead = (resource) => hasPermission(resource, 'read');
  const canCreate = (resource) => hasPermission(resource, 'create');
  const canUpdate = (resource) => hasPermission(resource, 'update');
  const canDelete = (resource) => hasPermission(resource, 'delete');

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    permissions,
    login,
    register,
    logout,
    API_BASE_URL,
    hasPermission,
    hasAnyPermission,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
