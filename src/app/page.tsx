'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, getUserRole, canAccessDashboard, clearAuthSession } from '@/lib/session';
import { User } from '@/types/auth.type';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentUser(getUser());
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
    setCurrentUser(null);
    router.refresh();
  };

  const role = getUserRole();
  const hasDashboardAccess = canAccessDashboard();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold">
              BF
            </div>
            <div>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                BookFlow
              </span>
              <span className="ml-2 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-blue-400">
                Clinic & Appointment Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {currentUser.full_name}
                  </span>
                  <span className="text-[11px] text-zinc-500 capitalize">
                    Role: {role}
                  </span>
                </div>

                {hasDashboardAccess ? (
                  <Link
                    href="/dashboard"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-500"
                  >
                    Open Dashboard &rarr;
                  </Link>
                ) : (
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Patient Portal Active
                  </span>
                )}

                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero / Public Portal Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <span>●</span> Access Policy: Staff Dashboard & Patient Portal
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Smart Healthcare Scheduling & Consultations
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to the public booking portal. Patients can view availability and request bookings here, while clinical staff (Doctors, Nurses, Cashiers, Admins) manage daily operations in the dashboard.
          </p>

          {/* Conditional Action Buttons based on User Role */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {mounted && currentUser ? (
              hasDashboardAccess ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
                  >
                    Go to Operations Dashboard &rarr;
                  </Link>
                  <button
                    onClick={() => alert(`Logged in as ${role?.toUpperCase()}. You have full access to both Dashboard and Home page.`)}
                    className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
                  >
                    View Role Permissions
                  </button>
                </>
              ) : (
                <div className="w-full max-w-md rounded-2xl border border-blue-200 bg-blue-50/60 p-5 text-left dark:border-blue-950 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-semibold text-sm">
                    <span>🧑‍💼</span> Patient Portal (Home Page Only)
                  </div>
                  <p className="mt-1 text-xs text-blue-800/80 dark:text-blue-400">
                    Hello, <strong>{currentUser.full_name}</strong>. Your account has patient access to book appointments, review consultations, and check billing. Staff dashboards are restricted.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => alert('Appointment Booking dialog for Patients is ready!')}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Book New Consultation
                    </button>
                    <button
                      onClick={() => alert('Viewing your active appointments...')}
                      className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs font-medium text-blue-900 hover:bg-blue-50 dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-200 cursor-pointer"
                    >
                      My Consultations
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 transition-all"
                >
                  Sign In to Continue &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Role Access Matrix Grid */}
        <div className="mt-16 w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 text-left">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Access Control Policy Matrix
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                  <th className="py-2.5 font-semibold">Role</th>
                  <th className="py-2.5 font-semibold">Home Page (/)</th>
                  <th className="py-2.5 font-semibold">Dashboard (/dashboard)</th>
                  <th className="py-2.5 font-semibold">Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300">
                <tr>
                  <td className="py-2.5 font-semibold text-purple-600 dark:text-purple-400">⚡ Admin</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5">Full clinic operations, user & role management</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-blue-600 dark:text-blue-400">🩺 Doctor</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5">Consultations, schedule, clinical notes</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">💉 Nurse</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5">Triage, patient check-in, vitals intake</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-amber-600 dark:text-amber-400">💳 Cashier</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5">Billing, invoices, point-of-sale payments</td>
                </tr>
                <tr className="bg-blue-50/50 dark:bg-blue-950/20 font-medium">
                  <td className="py-2.5 font-semibold text-blue-700 dark:text-blue-300">🧑‍💼 Patient</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">✓ Allowed</td>
                  <td className="py-2.5 text-red-500 font-semibold">✕ Blocked (Redirects to Home)</td>
                  <td className="py-2.5">Consultation booking, personal appointments & invoices</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
