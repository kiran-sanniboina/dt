import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: 'TEACHER' | 'ADMIN' | 'TEAM_LEAD' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginTeacher: (email: string, password: string) => Promise<void>;
  loginTeamLead: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cph_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = user?.role || null;
  const isAuthenticated = !!token && !!user;

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('cph_token');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        if (res.data.user) {
          setUser(res.data.user);
        } else if (res.data.team) {
          const t = res.data.team;
          setUser({
            id: t._id,
            name: t.teamLeadName,
            email: t.teamLeadEmail,
            role: 'TEAM_LEAD',
            teamId: t._id,
            sectionId: t.sectionId?._id || t.sectionId,
            yearId: t.yearId?._id || t.yearId,
          });
        }
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem('cph_token');
      localStorage.removeItem('cph_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginTeacher = async (email: string, password: string) => {
    const res = await api.post('/auth/teacher/login', { email, password });
    if (res.data.success) {
      const receivedToken = res.data.token;
      const receivedUser = res.data.user;
      localStorage.setItem('cph_token', receivedToken);
      localStorage.setItem('cph_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    }
  };

  const loginTeamLead = async (email: string, password: string) => {
    const res = await api.post('/auth/teamlead/login', { email, password });
    if (res.data.success) {
      const receivedToken = res.data.token;
      const teamData = res.data.team;
      const userPayload: UserProfile = {
        id: teamData.id,
        name: teamData.teamLeadName,
        email: teamData.teamLeadEmail,
        role: 'TEAM_LEAD',
        teamId: teamData.id,
        sectionId: teamData.section?._id || teamData.section,
        yearId: teamData.year?._id || teamData.year,
      };
      localStorage.setItem('cph_token', receivedToken);
      localStorage.setItem('cph_user', JSON.stringify(userPayload));
      setToken(receivedToken);
      setUser(userPayload);
    }
  };

  const logout = () => {
    localStorage.removeItem('cph_token');
    localStorage.removeItem('cph_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isLoading,
        loginTeacher,
        loginTeamLead,
        logout,
        refreshUser,
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
