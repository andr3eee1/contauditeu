import * as React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  isVerified?: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('contaudit_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('contaudit_user');
        localStorage.removeItem('contaudit_token');
      }
    }
  }, []);

  const login = React.useCallback((token: string, newUser: User) => {
    localStorage.setItem('contaudit_token', token);
    localStorage.setItem('contaudit_user', JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('contaudit_token');
    localStorage.removeItem('contaudit_user');
    setUser(null);
  }, []);

  const updateUser = React.useCallback((updatedUser: User) => {
    localStorage.setItem('contaudit_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
