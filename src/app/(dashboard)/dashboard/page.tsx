'use client';

import { useEffect, useState } from 'react';
import { getUser, getUserRole } from '@/lib/session';
import { User } from '@/types/auth.type';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const role = getUserRole() || 'staff';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
            <span>●</span> Access Granted: Staff Dashboard
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {user?.full_name || 'Staff Member'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            You are signed in as an authorized <strong className="text-white capitalize">{role}</strong>. You have permissions to access clinical operations, appointments, and dashboard metrics.
          </p>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
          {role.toUpperCase()} Workspace Metrics
        </h3>

        {/* Doctor View */}
        {role === 'doctor' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Today&apos;s Appointments</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-400">8</div>
              <span className="text-xs text-emerald-400">3 completed • 5 upcoming</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Pending Consultations</span>
              <div className="mt-2 text-3xl font-extrabold text-amber-400">2</div>
              <span className="text-xs text-zinc-400">Ready in waiting room</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Patient Records</span>
              <div className="mt-2 text-3xl font-extrabold text-indigo-400">142</div>
              <span className="text-xs text-zinc-400">Total assigned files</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Clinical Availability</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">Active</div>
              <span className="text-xs text-zinc-400">08:00 AM - 05:00 PM</span>
            </div>
          </div>
        )}

        {/* Nurse View */}
        {role === 'nurse' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Triage Queue</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">4</div>
              <span className="text-xs text-zinc-400">Patients waiting for vitals</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Checked-in Today</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-400">18</div>
              <span className="text-xs text-emerald-400">All intake forms signed</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Active Examination Rooms</span>
              <div className="mt-2 text-3xl font-extrabold text-purple-400">6 / 8</div>
              <span className="text-xs text-zinc-400">2 rooms currently open</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Care Coordination</span>
              <div className="mt-2 text-3xl font-extrabold text-amber-400">Normal</div>
              <span className="text-xs text-zinc-400">No triage delays reported</span>
            </div>
          </div>
        )}

        {/* Cashier View */}
        {role === 'cashier' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Today&apos;s Revenue</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">$2,450</div>
              <span className="text-xs text-emerald-400">+14% vs yesterday</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Invoices Issued</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-400">22</div>
              <span className="text-xs text-zinc-400">Consultations & treatments</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Pending Payments</span>
              <div className="mt-2 text-3xl font-extrabold text-amber-400">3</div>
              <span className="text-xs text-zinc-400">Awaiting checkout</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">POS Terminal Status</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">Online</div>
              <span className="text-xs text-zinc-400">Cash & Card reader ready</span>
            </div>
          </div>
        )}

        {/* Admin View */}
        {(role === 'admin' || role === 'super_admin') && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Active Staff Users</span>
              <div className="mt-2 text-3xl font-extrabold text-purple-400">5</div>
              <span className="text-xs text-zinc-400">Doctors, Nurses, Cashier</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Total Roles</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-400">5</div>
              <span className="text-xs text-zinc-400">admin, doctor, nurse, cashier, patient</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">System Permissions</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">24</div>
              <span className="text-xs text-emerald-400">All permissions active</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <span className="text-xs text-zinc-400 font-medium">Database Connection</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">Healthy</div>
              <span className="text-xs text-zinc-400">PostgreSQL 17 on Supabase</span>
            </div>
          </div>
        )}
      </div>

      {/* Role Access Rules Notice */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h4 className="text-sm font-semibold text-white">System Access Control Policy</h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-zinc-400">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <div>
              <strong className="text-zinc-200">Staff Access:</strong>{' '}
              Admins, Doctors, Nurses, and Cashiers have full access to this Operations Dashboard and the Public Home page.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">ℹ</span>
            <div>
              <strong className="text-zinc-200">Patient Access:</strong>{' '}
              Patients are restricted to the Public Home page and appointment booking portal. Access to this dashboard is blocked.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
