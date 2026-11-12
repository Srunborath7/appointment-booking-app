'use client';

import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const THEME_STORAGE_KEY = 'bookflow_theme_mode';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDOM(themeToApply: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (themeToApply === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    if (body) {
      body.classList.add('dark');
      body.classList.remove('light');
      body.setAttribute('data-theme', 'dark');
    }
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
      body.setAttribute('data-theme', 'light');
    }
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',

  initTheme: () => {
    if (typeof window === 'undefined') return;

    let stored: Theme = 'system';
    try {
      const val = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (val === 'light' || val === 'dark' || val === 'system') {
        stored = val;
      }
    } catch (_) {}

    const resolved = stored === 'system' ? getSystemTheme() : stored;
    applyThemeToDOM(resolved);
    set({ theme: stored, resolvedTheme: resolved });

    // Listen to OS system changes if 'system' is selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentTheme = get().theme;
      if (currentTheme === 'system') {
        const nextResolved = e.matches ? 'dark' : 'light';
        applyThemeToDOM(nextResolved);
        set({ resolvedTheme: nextResolved });
      }
    };

    mediaQuery.removeEventListener('change', handleSystemChange);
    mediaQuery.addEventListener('change', handleSystemChange);
  },

  setTheme: (newTheme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (_) {}

    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    applyThemeToDOM(resolved);
    set({ theme: newTheme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const nextTheme: Theme = current === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));
