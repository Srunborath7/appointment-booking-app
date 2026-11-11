'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getUser,
  getUserRole,
  canAccessDashboard,
  isAuthenticated,
  clearAuthSession,
} from '@/lib/session';
import { User } from '@/types/auth.type';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check if authenticated
    if (!isAuthenticated()) {
      router.replace('/auth/login?redirect=/dashboard');
      return;
    }

    // 2. Check role authorization:
    // admin, doctor, nurse, cashier -> ALLOWED
    // patient -> DENIED (only home page allowed)
    const role = getUserRole();
    if (role === 'patient' || !canAccessDashboard()) {
      alert('Access restricted: Patients can only access the patient portal and booking home page.');
      router.replace('/');
      return;
    }

    // User is authorized
    setCurrentUser(getUser());
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  const handleSignOut = () => {
    clearAuthSession();
    router.push('/auth/login');
    router.refresh();
  };

  // Always render children so Next.js PPR / instant navigation can validate the child segment.
  // When verifying authorization, show the overlay so unauthorized content is never visible.
  const roleName = currentUser?.role?.name?.toLowerCase() || 'staff';

  const roleBadgeColors: Record<string, string> = {
    admin: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    doctor: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    nurse: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    cashier: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  };

  const roleBadgeIcons: Record<string, string> = {
    admin: '⚡',
    doctor: '🩺',
    nurse: '💉',
    cashier: '💳',
  };

  return (
    <div className="relative flex min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Fullscreen verification overlay until authenticated & authorized */}
      {(isLoading || !isAuthorized) && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-zinc-950 text-white">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="text-sm font-medium text-zinc-400">
              Verifying staff permissions...
            </span>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900/60 p-5 md:flex">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold">
            BF
          </div>
          <span className="text-lg font-bold tracking-tight text-white">BookFlow</span>
        </Link>

        {/* Role Pill Banner */}
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Active Role
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${
                roleBadgeColors[roleName] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
            >
              <span>{roleBadgeIcons[roleName] || '👤'}</span>
              {roleName} Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-blue-600/15 px-3 py-2.5 text-sm font-semibold text-blue-400 border border-blue-500/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Public Home Page
          </Link>
        </nav>

        {/* Bottom User Profile Card */}
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white uppercase">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-white">
                  {currentUser?.full_name}
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 hover:border-red-900/40 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-white">
              Clinical & Operations Workspace
            </h1>
            <span className="hidden sm:inline-block rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              Staff Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              &larr; View Home Page
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
