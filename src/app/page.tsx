'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, getUserRole, canAccessDashboard, clearAuthSession } from '@/lib/session';
import { User } from '@/types/auth.type';
import { Appointment, Doctor, PatientProfile } from '@/types/patient.type';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  AppointmentCard,
  DoctorCard,
  BookingModal,
  ProfileModal,
} from '@/components/patient';

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctor_id: 'doc-1',
    doctor_name: 'Dr. Sarah Smith',
    doctor_specialty: 'Senior Cardiologist',
    department: 'Cardiology',
    date: '2026-11-13',
    time: '10:30 AM',
    status: 'confirmed',
    room: 'Room 204 • Cardiology Wing',
    reason: 'Quarterly cardiovascular review and blood pressure assessment',
  },
  {
    id: 'apt-2',
    doctor_id: 'doc-2',
    doctor_name: 'Dr. Marcus Vance',
    doctor_specialty: 'General Practitioner',
    department: 'General Medicine',
    date: '2026-11-20',
    time: '02:00 PM',
    status: 'pending',
    room: 'Consultation Suite B',
    reason: 'Follow-up consultation on annual medical checkup',
  },
  {
    id: 'apt-3',
    doctor_id: 'doc-4',
    doctor_name: 'Dr. David Miller',
    doctor_specialty: 'Dental Surgeon',
    department: 'Dental Care',
    date: '2026-10-15',
    time: '09:00 AM',
    status: 'completed',
    room: 'Dental Suite 1',
    reason: 'Bi-annual teeth scaling and preventative polish',
  },
];

const DOCTORS_LIST: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Smith',
    specialty: 'Senior Cardiologist',
    department: 'Cardiology',
    avatar: 'SS',
    rating: 4.9,
    reviews_count: 142,
    available_days: ['Mon', 'Tue', 'Thu', 'Fri'],
    slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
    fee: '$35.00',
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    specialty: 'General Practitioner',
    department: 'General Medicine',
    avatar: 'MV',
    rating: 4.8,
    reviews_count: 98,
    available_days: ['Mon', 'Wed', 'Fri', 'Sat'],
    slots: ['08:30 AM', '11:00 AM', '01:30 PM', '04:00 PM'],
    fee: '$25.00',
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Chen',
    specialty: 'Pediatric Specialist',
    department: 'Pediatrics',
    avatar: 'EC',
    rating: 5.0,
    reviews_count: 180,
    available_days: ['Tue', 'Wed', 'Thu', 'Sat'],
    slots: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
    fee: '$30.00',
  },
  {
    id: 'doc-4',
    name: 'Dr. David Miller',
    specialty: 'Dental Surgeon',
    department: 'Dental Care',
    avatar: 'DM',
    rating: 4.9,
    reviews_count: 115,
    available_days: ['Mon', 'Tue', 'Thu'],
    slots: ['10:00 AM', '01:00 PM', '03:00 PM'],
    fee: '$40.00',
  },
];

type ActiveTab = 'overview' | 'appointments' | 'doctors' | 'health-profile';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Doctors filtering
  const [doctorSearch, setDoctorSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Patient health profile
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    id: 'pat-1',
    first_name: 'Borath',
    last_name: 'Srun',
    phone_number: '+855 12 888 999',
    email: 'borath@patient.com',
    blood_group: 'O+',
    allergies: 'Penicillin, Shellfish',
    medical_history: 'Mild Seasonal Allergic Rhinitis; no chronic cardiovascular issues',
    emergency_contact_name: 'Srun Kosal (Father)',
    emergency_contact_phone: '+855 92 777 666',
    address: 'Street 271, Phnom Penh, Cambodia',
    created_at: '2026-11-12T00:00:00.000Z',
    updated_at: '2026-11-12T00:00:00.000Z',
  });

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
    if (user) {
      setPatientProfile((prev) => ({
        ...prev,
        first_name: user.full_name.split(' ')[0] || prev.first_name,
        last_name: user.full_name.split(' ').slice(1).join(' ') || prev.last_name,
        email: user.email,
        phone_number: user.phone_number || prev.phone_number,
      }));
    }
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
    setCurrentUser(null);
    router.refresh();
  };

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctorForBooking(doc);
    setIsBookingOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setSelectedDoctorForBooking(null);
    setIsBookingOpen(true);
  };

  const handleNewBookingCreated = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    setActiveTab('appointments');
  };

  const handleCancelAppointment = (aptId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === aptId ? { ...apt, status: 'cancelled' } : apt))
      );
    }
  };

  const handleRescheduleAppointment = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId);
    if (apt) {
      const doc = DOCTORS_LIST.find((d) => d.id === apt.doctor_id) || DOCTORS_LIST[0];
      handleBookDoctor(doc);
    }
  };

  const handleSaveProfile = async (updated: PatientProfile) => {
    setPatientProfile(updated);
  };

  const role = getUserRole();
  const hasDashboardAccess = canAccessDashboard();

  // Filtered lists
  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter === 'upcoming') {
      return apt.status === 'confirmed' || apt.status === 'pending';
    }
    if (appointmentFilter === 'completed') {
      return apt.status === 'completed';
    }
    return true;
  });

  const filteredDoctors = DOCTORS_LIST.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.department.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesDept = deptFilter === 'All' || doc.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const nextUpcoming = appointments.find(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Top Clinic Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                BF
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                  BookFlow
                </span>
                <span className="ml-2 hidden sm:inline-block rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-emerald-400">
                  ● Clinic Open
                </span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'appointments', label: 'My Appointments' },
                { id: 'doctors', label: 'Doctors & Clinics' },
                { id: 'health-profile', label: 'Health Profile' },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleOpenGeneralBooking}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer active:scale-95"
            >
              <span>+ Book Consultation</span>
            </button>

            <ThemeToggle />

            {mounted && currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {currentUser.full_name}
                  </span>
                  <span className="text-[10px] text-zinc-500 capitalize">
                    {role || 'Patient'}
                  </span>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-xs">
                  {currentUser.full_name.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-500 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden border-t border-zinc-100 dark:border-zinc-800/80 px-4 py-2 overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'doctors', label: 'Doctors' },
            { id: 'health-profile', label: 'Health' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Staff Role Switcher Banner (If logged in as Doctor/Nurse/Admin/Cashier) */}
      {mounted && hasDashboardAccess && (
        <div className="border-b border-indigo-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 px-4 py-2.5 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Staff Clearance Active: Logged in as <strong>{role?.toUpperCase()}</strong> ({currentUser?.full_name})
              </span>
            </div>
            <Link
              href="/dashboard"
              className="rounded-lg bg-white/20 hover:bg-white/30 px-3 py-1 font-semibold text-white transition-colors flex items-center gap-1"
            >
              <span>Open Staff Operations Dashboard</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-xs">
                  <span>🏥</span>
                  <span>Integrated Healthcare Portal</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Welcome back, {patientProfile.first_name || 'Patient'} 👋
                </h1>
                <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                  Book direct doctor consultations, check real-time availability, manage upcoming clinic appointments, and update your personal health records.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={handleOpenGeneralBooking}
                    className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-900 shadow-md hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    + Book New Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    Explore 15+ Specialists
                  </button>
                </div>
              </div>

              {/* Decorative Background Blob */}
              <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>

            {/* Quick Health Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Next Appointment Card */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">Next Consultation</span>
                  <span>🗓️</span>
                </div>
                {nextUpcoming ? (
                  <div className="mt-3">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {nextUpcoming.date}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {nextUpcoming.time} with {nextUpcoming.doctor_name}
                    </p>
                    <span className="mt-2 inline-block rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-blue-400">
                      {nextUpcoming.room}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-zinc-500">
                    No pending bookings.{' '}
                    <button
                      onClick={handleOpenGeneralBooking}
                      className="text-blue-600 font-semibold underline cursor-pointer"
                    >
                      Book now
                    </button>
                  </div>
                )}
              </div>

              {/* Blood Group */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">Blood Group</span>
                  <span>🩸</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                    {patientProfile.blood_group || 'O+'}
                  </span>
                  <span className="text-[11px] text-zinc-400">Universal Donor</span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">Verified clinical profile</p>
              </div>

              {/* Active Allergies */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">Recorded Allergies</span>
                  <span>⚠️</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 line-clamp-1">
                    {patientProfile.allergies || 'None recorded'}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Shared with consulting doctors
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold">Emergency Contact</span>
                  <span>🚨</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {patientProfile.emergency_contact_name || 'Not set'}
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    {patientProfile.emergency_contact_phone || 'Tap to add contact'}
                  </p>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="mt-1.5 text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Edit details &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Upcoming Consultations
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Your scheduled clinic visits and doctor sessions
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
                >
                  View All ({appointments.length}) &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments
                  .filter((a) => a.status === 'confirmed' || a.status === 'pending')
                  .slice(0, 2)
                  .map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onCancel={handleCancelAppointment}
                      onReschedule={handleRescheduleAppointment}
                    />
                  ))}
              </div>
            </div>

            {/* Featured Doctors Slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Top Clinic Specialists
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Available for in-person and tele-health consultation today
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
                >
                  Browse Directory &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOCTORS_LIST.slice(0, 4).map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} onSelect={handleBookDoctor} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  My Appointment Schedule
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Review upcoming clinical bookings, past consultation summaries, and reschedule requests
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
                {(['upcoming', 'completed', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppointmentFilter(filter)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                      appointmentFilter === filter
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onCancel={handleCancelAppointment}
                    onReschedule={handleRescheduleAppointment}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
                <div className="text-4xl">🗓️</div>
                <h4 className="mt-3 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  No appointments found
                </h4>
                <p className="mt-1 text-xs text-zinc-500">
                  You do not have any {appointmentFilter} appointments scheduled.
                </p>
                <button
                  onClick={handleOpenGeneralBooking}
                  className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 cursor-pointer"
                >
                  Book Your Consultation Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* DOCTORS DIRECTORY TAB */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Clinic Specialists & Doctors
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select a certified physician and book instant consultation slots
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 pl-9 text-xs text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                'All',
                'General Medicine',
                'Cardiology',
                'Pediatrics',
                'Dental Care',
              ].map((dept) => {
                const active = deptFilter === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} onSelect={handleBookDoctor} />
              ))}
            </div>
          </div>
        )}

        {/* HEALTH PROFILE TAB */}
        {activeTab === 'health-profile' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Personal Clinical & Emergency Records
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Information available to clinical doctors during examination and treatment
                </p>
              </div>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 cursor-pointer"
              >
                ✏️ Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md">
                    {patientProfile.first_name[0]}
                    {patientProfile.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                      {patientProfile.first_name} {patientProfile.last_name}
                    </h3>
                    <p className="text-xs text-zinc-500">{patientProfile.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-emerald-400">
                      Patient Portal ID: #{patientProfile.id}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800 text-xs">
                  <div>
                    <span className="text-zinc-400">Contact Number:</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {patientProfile.phone_number || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Residential Address:</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {patientProfile.address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-4">
                    Clinical Identifiers & History
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                      <span className="text-zinc-400 block mb-1">Blood Type</span>
                      <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                        {patientProfile.blood_group || 'O+'}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                      <span className="text-zinc-400 block mb-1">Drug & Food Allergies</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {patientProfile.allergies || 'No known allergies'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 text-xs">
                    <span className="text-zinc-400 block mb-1">Documented Medical History</span>
                    <p className="font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {patientProfile.medical_history || 'No chronic or severe conditions recorded.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-3">
                    Emergency Notification Contact
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 text-xs gap-2">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                        {patientProfile.emergency_contact_name || 'No contact configured'}
                      </span>
                      <span className="text-zinc-500">Designated Emergency Delegate</span>
                    </div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {patientProfile.emergency_contact_phone || '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedDoctor={selectedDoctorForBooking}
        onBookSuccess={handleNewBookingCreated}
      />

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={patientProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
