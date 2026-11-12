'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { Sidebar } from '@/components/navigation/sidebar';
import { Header } from '@/components/navigation/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, role, canAccessDashboard, isLoading, initAuth } = useAuthStore();
  const initSidebar = useSidebarStore((s) => s.initSidebar);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    initSidebar();
    setMounted(true);
  }, [initAuth, initSidebar]);

  useEffect(() => {
    if (!mounted || isLoading) return;

    // 1. Check if authenticated
    if (!isLoggedIn) {
      router.replace('/auth/login?redirect=/dashboard');
      return;
    }

    // 2. Check role authorization:
    // admin, doctor, nurse, cashier -> ALLOWED
    // patient -> DENIED (only home page allowed)
    if (role === 'patient' || !canAccessDashboard) {
      alert('Access restricted: Patients can only access the patient portal and booking home page.');
      router.replace('/');
      return;
    }
  }, [mounted, isLoading, isLoggedIn, role, canAccessDashboard, router]);

  const isVerifying = !mounted || isLoading || !isLoggedIn || role === 'patient' || !canAccessDashboard;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-150 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Fullscreen verification overlay until authenticated & authorized */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-white">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Verifying staff permissions...
            </span>
          </div>
        </div>
      )}

      {/* Pinned Desktop Sidebar & Mobile Slide-Out Drawer */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Sticky Header */}
        <Header />

        {/* Independently Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
