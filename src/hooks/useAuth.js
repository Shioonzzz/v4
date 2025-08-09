import { useState, useEffect, createContext, useContext } from 'react';

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      // Since we can't use localStorage in Claude artifacts, we'll simulate with memory
      const userData = getUserFromMemory();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API call
      const response = await simulateLogin(email, password);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          fullName: response.user.fullName,
          token: response.token,
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        saveUserToMemory(userData);
        
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setLoading(true);
    
    try {
      // Simulate API call
      const response = await simulateRegister(email, password, fullName);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          fullName: response.user.fullName,
          token: response.token,
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        saveUserToMemory(userData);
        
        return userData;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearUserFromMemory();
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUserToMemory(updatedUser);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Memory-based storage simulation (since localStorage is not available)
let memoryStorage = {};

const saveUserToMemory = (userData) => {
  memoryStorage.user = userData;
};

const getUserFromMemory = () => {
  return memoryStorage.user || null;
};

const clearUserFromMemory = () => {
  memoryStorage = {};
};

// Simulate API calls
const simulateLogin = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo credentials
  const demoUsers = [
    {
      id: '1',
      email: 'demo@financialbot.com',
      password: 'demo123',
      fullName: 'Demo User'
    },
    {
      id: '2', 
      email: 'user@test.com',
      password: 'password',
      fullName: 'Test User'
    }
  ];
  
  const user = demoUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      token: `demo_token_${user.id}_${Date.now()}`,
      message: 'Login successful'
    };
  } else {
    return {
      success: false,
      message: 'Email atau password salah'
    };
  }
};

const simulateRegister = async (email, password, fullName) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Basic validation
  if (!email || !password || !fullName) {
    return {
      success: false,
      message: 'Semua field harus diisi'
    };
  }
  
  if (password.length < 6) {
    return {
      success: false,
      message: 'Password minimal 6 karakter'
    };
  }
  
  // Check if email already exists (simulate)
  if (email === 'demo@financialbot.com' || email === 'user@test.com') {
    return {
      success: false,
      message: 'Email sudah terdaftar'
    };
  }
  
  // Simulate successful registration
  const newUser = {
    id: `user_${Date.now()}`,
    email,
    fullName
  };
  
  return {
    success: true,
    user: newUser,
    token: `demo_token_${newUser.id}_${Date.now()}`,
    message: 'Registration successful'
  };
};

// Auth utilities
export const authUtils = {
  isTokenValid: (token) => {
    if (!token) return false;
    // Simple token validation (in real app, check expiration, etc.)
    return token.startsWith('demo_token_');
  },
  
  getTokenExpirationTime: (token) => {
    // Extract timestamp from token and add 24 hours
    const parts = token.split('_');
    const timestamp = parseInt(parts[parts.length - 1]);
    return new Date(timestamp + 24 * 60 * 60 * 1000);
  },
  
  shouldRefreshToken: (token) => {
    const expTime = authUtils.getTokenExpirationTime(token);
    const now = new Date();
    const timeLeft = expTime - now;
    // Refresh if less than 1 hour left
    return timeLeft < 60 * 60 * 1000;
  }
};

export default useAuth;