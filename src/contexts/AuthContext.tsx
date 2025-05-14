
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demonstration
const MOCK_USERS = [
  { id: '1', username: 'admin', password: 'admin123' },
  { id: '2', username: 'doctor', password: 'doctor123' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing user session in localStorage
    const savedUser = localStorage.getItem('btms-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('btms-user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find(
      user => user.username === username && user.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('btms-user', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    return false;
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if username already exists
    const userExists = MOCK_USERS.some(user => user.username === username);
    if (userExists) {
      toast({
        title: "Signup failed",
        description: "Username already exists",
        variant: "destructive",
      });
      return false;
    }
    
    // In a real app, this would be handled by a backend
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      username,
      password
    };
    MOCK_USERS.push(newUser);
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('btms-user', JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Account created",
      description: `Welcome, ${username}!`,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('btms-user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
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
