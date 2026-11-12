'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Header() {
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar, toggleMobileMenu } = useSidebarStore();
  const { currentUser, role, logout } = useAuthStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleName = role || currentUser?.role?.name?.toLowerCase() || 'staff';

  const roleBadgeColors: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    doctor: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    nurse: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    cashier: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
  };

  const roleBadgeIcons: Record<string, string> = {
    admin: '⚡',
    doctor: '🩺',
    nurse: '💉',
    cashier: '💳',
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const handleSignOut = () => {
    logout();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 shrink-0 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-[#0c1017]/80">
      {/* Left section: Hamburger (mobile) / Collapse Toggle (desktop) + Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Quick Collapse/Expand Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            <line x1="9" y1="3" x2="9" y2="21" strokeWidth={2} />
          </svg>
        </button>

        {/* Quick Search */}
        <div className="relative w-full hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-zinc-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search appointments, patients, records..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-12 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200 dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900 transition-all"
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[10px] font-medium text-slate-400 dark:text-zinc-500">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right section: System Status, Role Badge, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Clinic Online</span>
        </div>

        {/* Role Indicator Pill */}
        <span
          className={`hidden md:inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${
            roleBadgeColors[roleName] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          <span>{roleBadgeIcons[roleName] || '👤'}</span>
          {roleName}
        </span>

        {/* Theme Toggle (Light / Dark / System) */}
        <ThemeToggle />

        {/* Profile Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="User menu"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white uppercase">
              {currentUser?.full_name?.charAt(0) || 'U'}
            </div>
            <svg
              className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400 hidden sm:block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl shadow-slate-200/50 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-black/50 z-50">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-zinc-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {currentUser?.full_name}
                </p>
                <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                  {currentUser?.email}
                </p>
                <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Role: {roleName}
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Visit Public Home
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1 dark:border-zinc-800">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
