import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DemoUser, Branch } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  demoUsers: DemoUser[];
  branches: Branch[];
  selectedBranchId: number | null;
  setSelectedBranchId: (id: number | null) => void;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<void>;
  switchUser: (username: string) => Promise<void>;
  logout: () => void;
  unreadNotificationsCount: number;
  refreshNotificationsCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const refreshNotificationsCount = async () => {
    try {
      const notifs = await api.getNotifications(true);
      setUnreadNotificationsCount(notifs.length);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [users, branchList] = await Promise.all([
          api.getDemoUsers(),
          api.getBranches()
        ]);
        setDemoUsers(users);
        setBranches(branchList);

        // Auto-login as Restaurant Manager or Super Admin if no active session
        const token = api.getToken();
        if (token) {
          try {
            const me = await api.getMe();
            setUser(me);
          } catch {
            api.setToken(null);
            // Fallback to manager demo login
            const loginRes = await api.login('manager', 'admin123');
            setUser(loginRes.user);
          }
        } else {
          // Default start as Restaurant Manager
          const loginRes = await api.login('manager', 'admin123');
          setUser(loginRes.user);
        }

        await refreshNotificationsCount();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (username: string, password = 'admin123') => {
    setIsLoading(true);
    try {
      const res = await api.login(username, password);
      setUser(res.user);
      await refreshNotificationsCount();
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (username: string) => {
    await login(username, 'admin123');
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUsers,
        branches,
        selectedBranchId,
        setSelectedBranchId,
        isLoading,
        login,
        switchUser,
        logout,
        unreadNotificationsCount,
        refreshNotificationsCount
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
