import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../config';

interface User {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  is_pro: boolean;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('AuthContext: Loading from localStorage');
      console.log('AuthContext: storedToken =', storedToken ? storedToken.substring(0, 20) + '...' : 'null');
      console.log('AuthContext: storedUser =', storedUser);
      
      if (storedToken && storedUser) {
        const userObj = JSON.parse(storedUser);
        console.log('AuthContext: Parsed user =', userObj);
        console.log('AuthContext: user.is_pro =', userObj.is_pro);
        setToken(storedToken);
        setUser(userObj);
      }
      setIsLoading(false);
    };

    loadUser();

    // Listen for storage changes (e.g., from other tabs or manual updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        console.log('AuthContext: Storage changed, updating user');
        setUser(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    
    // Fetch user info from /api/auth/me
    const userResponse = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      },
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      const user = {
        id: userData._id,
        email: userData.email,
        username: userData.username,
        is_admin: userData.is_admin || false,
        is_pro: userData.is_pro || false,
        credits: userData.credits || 3,
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password, full_name: username }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const userData = await response.json();
    
    // After registration, login to get token
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    // Simply reload from localStorage (since backend /api/auth/me is broken)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      console.log('refreshUser: Loading from localStorage:', userObj);
      setUser(userObj);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
