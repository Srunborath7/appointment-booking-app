'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

interface QueueItem {
  id: string;
  patientName: string;
  avatar: string;
  time: string;
  service: string;
  doctor: string;
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Pending Vitals';
  priority: 'Normal' | 'Urgent';
}

export default function DashboardPage() {
  const { currentUser: user, role: authRole } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'in_consultation' | 'completed'>('all');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const role = authRole || 'staff';

  const sampleQueue: QueueItem[] = [
    {
      id: 'Q-101',
      patientName: 'John Doe',
      avatar: 'JD',
      time: '09:00 AM',
      service: 'General Consultation',
      doctor: 'Dr. Sarah Smith',
      status: 'In Consultation',
      priority: 'Normal',
    },
    {
      id: 'Q-102',
      patientName: 'Alice Johnson',
      avatar: 'AJ',
      time: '09:30 AM',
      service: 'Cardiology Follow-up',
      doctor: 'Dr. Robert Chen',
      status: 'Waiting',
      priority: 'Urgent',
    },
    {
      id: 'Q-103',
      patientName: 'Michael Brown',
      avatar: 'MB',
      time: '10:00 AM',
      service: 'Blood Pressure & Vitals',
      doctor: 'Nurse Kelly',
      status: 'Pending Vitals',
      priority: 'Normal',
    },
    {
      id: 'Q-104',
      patientName: 'Emma Wilson',
      avatar: 'EW',
      time: '08:15 AM',
      service: 'Dental Cleaning',
      doctor: 'Dr. Sarah Smith',
      status: 'Completed',
      priority: 'Normal',
    },
    {
      id: 'Q-105',
      patientName: 'David Lee',
      avatar: 'DL',
      time: '10:45 AM',
      service: 'Pediatric Checkup',
      doctor: 'Dr. Robert Chen',
      status: 'Waiting',
      priority: 'Normal',
    },
  ];

  const filteredQueue = sampleQueue.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'waiting') return item.status === 'Waiting';
    if (activeTab === 'in_consultation') return item.status === 'In Consultation';
    if (activeTab === 'completed') return item.status === 'Completed';
    return true;
  });

  const getStatusBadge = (status: QueueItem['status']) => {
    switch (status) {
      case 'In Consultation':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Waiting':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Pending Vitals':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dynamic Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/5 p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-purple-950/20 dark:shadow-none">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>{currentDateStr || 'Clinical Workspace'}</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Welcome back, {user?.full_name || 'Staff Member'}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-zinc-400">
              You are signed in as an authorized <strong className="capitalize text-slate-900 dark:text-zinc-200">{role}</strong>. Monitor clinical appointments, triage patients, and manage daily operations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Appointment
            </Link>
            <button
              onClick={() => alert('Quick patient registration form will open here.')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register Patient
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            {role.toUpperCase()} Real-Time Metrics
          </h3>
          <span className="text-xs text-slate-400 dark:text-zinc-500">Live updating</span>
        </div>

        {/* Doctor Metrics */}
        {role === 'doctor' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Today&apos;s Appointments</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">8</div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">3 completed • 5 upcoming</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Pending Consultations</span>
              <div className="mt-2 text-3xl font-extrabold text-amber-500 dark:text-amber-400">2</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Ready in waiting room</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Assigned Patients</span>
              <div className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">142</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Active medical profiles</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Clinical Availability</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">On Duty</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">08:00 AM - 05:00 PM</span>
            </div>
          </div>
        )}

        {/* Nurse Metrics */}
        {role === 'nurse' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Triage Queue</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">4</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">1 high-priority</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Vitals Pending</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">3</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Patients in prep room</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Assigned Ward Beds</span>
              <div className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">12 / 16</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">75% capacity</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Shift Status</span>
              <div className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">Morning</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Ends at 03:00 PM</span>
            </div>
          </div>
        )}

        {/* Cashier Metrics */}
        {role === 'cashier' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Today&apos;s Invoices</span>
              <div className="mt-2 text-3xl font-extrabold text-amber-500 dark:text-amber-400">18</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">14 settled • 4 pending</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Collected Revenue</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">$1,480.00</div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+12% vs yesterday</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Pending Payments</span>
              <div className="mt-2 text-3xl font-extrabold text-rose-500 dark:text-rose-400">$320.00</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Awaiting insurance/cash</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Receipts Issued</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">14</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">All digital copies sent</span>
            </div>
          </div>
        )}

        {/* Admin Metrics */}
        {role === 'admin' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Total System Users</span>
              <div className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">5</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Across 5 configured roles</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Active Sessions</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">1</div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System secure & verified</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Today&apos;s Appointments</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">8</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Across 2 clinic doctors</span>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Database Status</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Healthy</div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Supabase pooler synced</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Responsive Grid: Queue Table & Right Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Today's Patient Queue Table (2/3 width) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors lg:col-span-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today&apos;s Clinical Queue & Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Real-time patient flow and appointment statuses
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-zinc-800/80">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-zinc-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('waiting')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'waiting'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-zinc-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Waiting
              </button>
              <button
                onClick={() => setActiveTab('in_consultation')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'in_consultation'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-zinc-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                In Care
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-zinc-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Responsive Queue Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:text-zinc-500">
                <tr>
                  <th className="pb-3 pr-4 font-semibold">Patient</th>
                  <th className="pb-3 px-4 font-semibold">Service</th>
                  <th className="pb-3 px-4 font-semibold">Time Slot</th>
                  <th className="pb-3 px-4 font-semibold">Provider</th>
                  <th className="pb-3 px-4 font-semibold">Status</th>
                  <th className="pb-3 pl-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-[11px] font-bold text-blue-700 dark:bg-blue-600/20 dark:text-blue-400">
                          {item.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {item.patientName}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-300">
                      {item.service}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-zinc-200">
                      {item.time}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400">
                      {item.doctor}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-medium ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <button
                        onClick={() => alert(`Opening details for patient ${item.patientName}`)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick Clinical Actions & Recent Activity Feed */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => alert('Search Patient Directory')}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center hover:bg-blue-50/50 hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200">Find Patient</span>
              </button>

              <button
                onClick={() => alert('Record Patient Vitals')}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center hover:bg-emerald-50/50 hover:border-emerald-200 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200">Triage / Vitals</span>
              </button>

              <button
                onClick={() => alert('Generate Invoice')}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center hover:bg-amber-50/50 hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200">Quick Invoice</span>
              </button>

              <button
                onClick={() => alert('Doctor Duty Schedule')}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-center hover:bg-purple-50/50 hover:border-purple-200 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200">Duty Schedule</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Live Activity Feed
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                  🩺
                </div>
                <div>
                  <p className="text-xs text-slate-700 dark:text-zinc-300">
                    <strong className="text-slate-900 dark:text-white">Dr. Sarah Smith</strong> called patient <strong>John Doe</strong> into Consultation Rm 2.
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">5 mins ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                  💉
                </div>
                <div>
                  <p className="text-xs text-slate-700 dark:text-zinc-300">
                    <strong className="text-slate-900 dark:text-white">Nurse Kelly</strong> uploaded vitals for <strong>Alice Johnson</strong> (BP: 120/80).
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">18 mins ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
                  💳
                </div>
                <div>
                  <p className="text-xs text-slate-700 dark:text-zinc-300">
                    <strong className="text-slate-900 dark:text-white">Cashier</strong> cleared Invoice #INV-1042 for <strong>Emma Wilson</strong> ($45.00).
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">42 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
