import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient, { setAuthToken } from './api';
import { User, Society } from '../types';

interface AuthContextType {
  user: User | null;
  society: Society | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  createSociety: (data: any) => Promise<boolean>;
  joinSociety: (code: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserSociety: (soc: Society, role?: 'ADMIN' | 'MEMBER') => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Demo Fallback User (Green Valley Society Admin)
const DEFAULT_DEMO_USER: User = {
  _id: 'usr_demo_admin_101',
  name: 'Priya Sharma (Admin)',
  email: 'admin@greenvalley.com',
  phone: '9876543210',
  flatNumber: 'A-402',
  buildingBlock: 'Tower A',
  societyId: 'soc_green_valley_426',
  role: 'ADMIN',
  totalSavings: 3450,
  joinedActivitiesCount: 12,
  createdRequestsCount: 5,
  completedDealsCount: 9,
};

const DEFAULT_DEMO_SOCIETY: Society = {
  _id: 'soc_green_valley_426',
  name: 'Green Valley Society',
  city: 'Mumbai',
  locality: 'Powai',
  address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai',
  inviteCode: 'GV426X',
  createdBy: 'usr_demo_admin_101',
  memberCount: 426,
  totalSocietySavings: 78500,
  isVerified: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USER);
  const [society, setSociety] = useState<Society | null>(DEFAULT_DEMO_SOCIETY);
  const [token, setToken] = useState<string | null>('demo_jwt_token_2026');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Attempt auto-sync with backend if live
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      if (!token) return;
      const res = await apiClient.get('/auth/me');
      if (res.data && res.data.success && res.data.user) {
        setUser(res.data.user);
        if (res.data.user.societyId) {
          setSociety(res.data.user.societyId);
        }
      }
    } catch (e) {
      // Gracefully maintain state if backend is offline
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password: pass });
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        if (res.data.user.society) {
          setSociety(res.data.user.society);
        }
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.log('Backend login error, falling back to local session authentication');
    }

    // Demo fallback logic for instant testing
    const isMember = email.includes('rahul');
    const demoUser: User = {
      _id: isMember ? 'usr_demo_member_202' : 'usr_demo_admin_101',
      name: isMember ? 'Rahul Verma' : 'Priya Sharma (Admin)',
      email: email,
      flatNumber: isMember ? 'B-104' : 'A-402',
      buildingBlock: isMember ? 'Tower B' : 'Tower A',
      societyId: 'soc_green_valley_426',
      role: isMember ? 'MEMBER' : 'ADMIN',
      totalSavings: isMember ? 2450 : 3450,
      joinedActivitiesCount: isMember ? 8 : 12,
      createdRequestsCount: isMember ? 3 : 5,
      completedDealsCount: isMember ? 6 : 9,
    };
    setUser(demoUser);
    setSociety(DEFAULT_DEMO_SOCIETY);
    setToken('demo_token');
    setIsLoading(false);
    return true;
  };

  const register = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', data);
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        setIsLoading(false);
        return true;
      }
    } catch (e) {
      // Local fallback
    }

    const newUser: User = {
      _id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      flatNumber: data.flatNumber,
      buildingBlock: data.buildingBlock || '',
      societyId: null,
      role: 'MEMBER',
      totalSavings: 0,
      joinedActivitiesCount: 0,
      createdRequestsCount: 0,
      completedDealsCount: 0,
    };
    setUser(newUser);
    setSociety(null);
    setIsLoading(false);
    return true;
  };

  const createSociety = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/societies', data);
      if (res.data && res.data.success) {
        setSociety(res.data.society);
        if (user) {
          setUser({ ...user, societyId: res.data.society._id, role: 'ADMIN' });
        }
        setIsLoading(false);
        return true;
      }
    } catch (e) {}

    const newSoc: Society = {
      _id: 'soc_' + Date.now(),
      name: data.name,
      city: data.city,
      locality: data.locality,
      address: data.address || '',
      inviteCode: 'SOC' + Math.floor(100 + Math.random() * 900),
      createdBy: user ? user._id : 'usr_1',
      memberCount: 1,
      totalSocietySavings: 0,
      isVerified: true,
    };
    setSociety(newSoc);
    if (user) {
      setUser({ ...user, societyId: newSoc._id, role: 'ADMIN' });
    }
    setIsLoading(false);
    return true;
  };

  const joinSociety = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/societies/join', { code });
      if (res.data && res.data.success) {
        setSociety(res.data.society);
        if (user) {
          setUser({ ...user, societyId: res.data.society._id });
        }
        setIsLoading(false);
        return true;
      }
    } catch (e) {}

    // Fallback join
    setSociety(DEFAULT_DEMO_SOCIETY);
    if (user) {
      setUser({ ...user, societyId: DEFAULT_DEMO_SOCIETY._id });
    }
    setIsLoading(false);
    return true;
  };

  const updateUserSociety = (soc: Society, role?: 'ADMIN' | 'MEMBER') => {
    setSociety(soc);
    if (user) {
      setUser({ ...user, societyId: soc._id, role: role || user.role });
    }
  };

  const logout = () => {
    setUser(null);
    setSociety(null);
    setToken(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        society,
        token,
        isLoading,
        login,
        register,
        createSociety,
        joinSociety,
        logout,
        refreshUser,
        updateUserSociety,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
