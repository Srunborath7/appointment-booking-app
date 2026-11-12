'use client';

import { create } from 'zustand';
import { User } from '@/types/auth.type';
import {
  getUser,
  getUserRole,
  isAuthenticated,
  canAccessDashboard,
  clearAuthSession,
  saveAuthSession,
} from '@/lib/session';

interface AuthState {
  currentUser: User | null;
  role: string | null;
  isLoggedIn: boolean;
  canAccessDashboard: boolean;
  isLoading: boolean;
  initAuth: () => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  role: null,
  isLoggedIn: false,
  canAccessDashboard: false,
  isLoading: true,

  initAuth: () => {
    if (typeof window === 'undefined') return;

    const loggedIn = isAuthenticated();
    const user = getUser();
    const role = getUserRole();
    const hasAccess = canAccessDashboard();

    set({
      currentUser: user,
      role: role,
      isLoggedIn: loggedIn,
      canAccessDashboard: hasAccess,
      isLoading: false,
    });
  },

  setUser: (user: User | null) => {
    if (user) {
      set({
        currentUser: user,
        role: user.role?.name?.toLowerCase() || null,
        isLoggedIn: true,
        canAccessDashboard: canAccessDashboard(),
        isLoading: false,
      });
    } else {
      clearAuthSession();
      set({
        currentUser: null,
        role: null,
        isLoggedIn: false,
        canAccessDashboard: false,
        isLoading: false,
      });
    }
  },

  logout: () => {
    clearAuthSession();
    set({
      currentUser: null,
      role: null,
      isLoggedIn: false,
      canAccessDashboard: false,
      isLoading: false,
    });
  },
}));
