import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import { apiUrl } from '@/lib/api';

interface MockUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: MockUser | null;
  login: (email: string, password: string) => Promise<void>; // Updated signature
  register: (username: string, email: string, password: string) => Promise<void>; // Updated signature
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const userResponse = await fetch(apiUrl('/v1/users/me'), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (userResponse.ok) {
            const user = await userResponse.json();
            setUser(user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      };
      fetchUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(apiUrl('/v1/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        const userResponse = await fetch(apiUrl('/v1/users/me'), {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        if (userResponse.ok) {
          const user = await userResponse.json();
          setUser(user);
          setIsLoggedIn(true);
          showSuccess(`Welcome back, ${user.username}!`);
        } else {
          throw new Error('Failed to fetch user data.');
        }
      } else {
        const errorData = await response.json();
        showError(errorData.detail || 'Login failed.');
        throw new Error(errorData.detail || 'Login failed.');
      }
    } catch (error) {
      showError('Login failed.');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(apiUrl('/v1/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        const userResponse = await fetch(apiUrl('/v1/users/me'), {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        if (userResponse.ok) {
          const user = await userResponse.json();
          setUser(user);
          setIsLoggedIn(true);
          showSuccess(`Account created and logged in as ${user.username}!`);
        } else {
          throw new Error('Failed to fetch user data.');
        }
      } else {
        const errorData = await response.json();
        showError(errorData.detail || 'Registration failed.');
        throw new Error(errorData.detail || 'Registration failed.');
      }
    } catch (error) {
      showError('Registration failed.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    showSuccess("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};