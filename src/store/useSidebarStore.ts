'use client';

import { create } from 'zustand';

interface SidebarState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  initSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  toggleMobileMenu: () => void;
}

const COLLAPSED_STORAGE_KEY = 'bookflow_sidebar_collapsed';

export const useSidebarStore = create<SidebarState>((set, get) => ({
  sidebarCollapsed: false,
  mobileMenuOpen: false,

  initSidebar: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (stored !== null) {
        set({ sidebarCollapsed: stored === 'true' });
      }
    } catch (_) {}
  },

  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
    } catch (_) {}
    set({ sidebarCollapsed: next });
  },

  setSidebarCollapsed: (v: boolean) => {
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(v));
    } catch (_) {}
    set({ sidebarCollapsed: v });
  },

  setMobileMenuOpen: (v: boolean) => {
    set({ mobileMenuOpen: v });
  },

  toggleMobileMenu: () => {
    set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen }));
  },
}));
