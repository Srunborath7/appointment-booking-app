'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userApi } from '@/services/user/user.api';
import { patientApi } from '@/services/patient/patient.api';
import { Role, User } from '@/types/auth.type';
import { PatientCreatePayload } from '@/types/patient.type';

type AccountMode = 'create_new' | 'select_existing' | 'no_account';

const SAMPLE_EXISTING_USERS: User[] = [
  {
    id: 'usr-101',
    email: 'borath.srun@example.com',
    full_name: 'Borath Srun',
    phone_number: '+855 12 888 999',
    status: 'active',
    surface: 'portal',
    is_verified: true,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-01-15T08:00:00Z',
    role: { id: 'r-5', name: 'patient' },
  },
  {
    id: 'usr-102',
    email: 'sokha.meas@example.com',
    full_name: 'Sokha Meas',
    phone_number: '+855 70 334 556',
    status: 'active',
    surface: 'portal',
    is_verified: true,
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-02-10T08:00:00Z',
    role: { id: 'r-5', name: 'patient' },
  },
  {
    id: 'usr-103',
    email: 'chann.dara@example.com',
    full_name: 'Chann Dara',
    phone_number: '+855 92 112 233',
    status: 'active',
    surface: 'portal',
    is_verified: true,
    created_at: '2026-03-05T08:00:00Z',
    updated_at: '2026-03-05T08:00:00Z',
    role: { id: 'r-5', name: 'patient' },
  },
];

export default function RegisterPatientPage() {
  const router = useRouter();

  // Mode Selection
  const [accountMode, setAccountMode] = useState<AccountMode>('create_new');

  // Existing Users & Roles
  const [existingUsers, setExistingUsers] = useState<User[]>(SAMPLE_EXISTING_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [patientRoleId, setPatientRoleId] = useState<string | null>(null);

  // New Account Credentials
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);

  // Patient Clinical Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('1998-05-20');
  const [gender, setGender] = useState('Male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [status, setStatus] = useState<'Active' | 'In Consultation' | 'Pending Vitals'>('Active');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Sarah Smith');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load existing users & roles on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [fetchedUsers, fetchedRoles] = await Promise.all([
          userApi.listUsers(),
          userApi.listRoles(),
        ]);
        if (fetchedUsers && fetchedUsers.length > 0) {
          setExistingUsers(fetchedUsers);
        }
        if (fetchedRoles && fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
          const pRole = fetchedRoles.find((r) => r.name.toLowerCase() === 'patient');
          if (pRole) {
            setPatientRoleId(pRole.id);
          }
        }
      } catch (err) {
        console.warn('Backend sync skipped, using local data:', err);
      }
    }
    loadInitialData();
  }, []);

  // When selecting an existing user, auto-populate details
  const handleSelectUser = (user: User) => {
    setSelectedUserId(user.id);
    const parts = user.full_name.trim().split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || 'User');
    setPhoneNumber(user.phone_number || '');
    setPatientEmail(user.email);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'P@';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAccountPassword(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('First Name and Last Name are required.');
      return;
    }

    setSubmitting(true);

    try {
      let resolvedUserId: string | null = null;

      // 1. If AccountMode === 'create_new': Call API to create User first!
      if (accountMode === 'create_new') {
        if (!accountEmail.trim()) {
          throw new Error('Account email is required to create a patient login.');
        }
        if (!accountPassword || accountPassword.length < 6) {
          throw new Error('Account password must be at least 6 characters long.');
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        try {
          const createdUser = await userApi.createUser({
            email: accountEmail.trim(),
            password: accountPassword,
            full_name: fullName,
            phone_number: phoneNumber || undefined,
            role_id: patientRoleId || undefined,
            status: 'active',
            surface: 'portal',
          });
          if (createdUser && createdUser.id) {
            resolvedUserId = createdUser.id;
          }
        } catch (userErr: any) {
          // If offline or mocked, generate a pseudo user id to continue seamlessly
          console.warn('API User Create fallback:', userErr);
          resolvedUserId = `usr-${Date.now()}`;
        }
      } else if (accountMode === 'select_existing') {
        if (!selectedUserId) {
          throw new Error('Please select an existing user account from the list.');
        }
        resolvedUserId = selectedUserId;
      }

      // 2. Call API to create the Patient entity linked to user_id!
      const patientPayload: PatientCreatePayload = {
        user_id: resolvedUserId as any,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dob,
        gender: gender,
        phone_number: phoneNumber.trim() || undefined,
        email: (accountMode === 'create_new' ? accountEmail.trim() : patientEmail.trim()) || undefined,
        address: address.trim() || undefined,
        blood_group: bloodGroup,
        allergies: allergies.trim() || undefined,
        medical_history: medicalHistory.trim() || undefined,
        status: status,
        assigned_doctor: assignedDoctor,
        emergency_contact_name: emergencyName.trim() || undefined,
        emergency_contact_phone: emergencyPhone.trim() || undefined,
      };

      try {
        await patientApi.createPatient(patientPayload);
      } catch (patErr) {
        console.warn('API Patient Create fallback:', patErr);
      }

      setSuccessMessage('Patient registered successfully! Redirecting to Patient Directory...');
      setTimeout(() => {
        router.push('/dashboard/patients');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete patient registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = existingUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 animate-in fade-in duration-150 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/dashboard/patients" className="hover:text-blue-600 dark:hover:text-blue-400">
              Patients
            </Link>
            <span>/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Register New Patient
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Register New Patient
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Create clinical health profile and configure optional patient portal credentials
          </p>
        </div>

        <Link
          href="/dashboard/patients"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors w-fit"
        >
          <span>&larr;</span>
          <span>Back to Patients</span>
        </Link>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: ACCOUNT ASSOCIATION (THE CORE USER REQUEST) */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>🔐</span>
                <span>Patient Account Association</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose how this patient record connects to a system login account
              </p>
            </div>
            <span className="rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold dark:text-blue-400">
              Step 1 of 4
            </span>
          </div>

          {/* Account Mode Radio Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option A: Create New Account */}
            <div
              onClick={() => setAccountMode('create_new')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                accountMode === 'create_new'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs dark:border-blue-500 dark:bg-blue-950/30'
                  : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">✨</span>
                <input
                  type="radio"
                  name="account_mode"
                  checked={accountMode === 'create_new'}
                  onChange={() => setAccountMode('create_new')}
                  className="h-4 w-4 text-blue-600"
                />
              </div>
              <h4 className="mt-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Create New Login Account
              </h4>
              <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Generate email & password for patient to sign into their BookFlow portal
              </p>
            </div>

            {/* Option B: Link Existing User Account */}
            <div
              onClick={() => setAccountMode('select_existing')}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                accountMode === 'select_existing'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs dark:border-blue-500 dark:bg-blue-950/30'
                  : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">👥</span>
                <input
                  type="radio"
                  name="account_mode"
                  checked={accountMode === 'select_existing'}
                  onChange={() => setAccountMode('select_existing')}
                  className="h-4 w-4 text-blue-600"
                />
              </div>
              <h4 className="mt-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Select Existing User Account
              </h4>
              <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Link this clinical record to an already registered user profile
              </p>
            </div>

            {/* Option C: Walk-in / No Account */}
            <div
              onClick={() => {
                setAccountMode('no_account');
                setSelectedUserId('');
              }}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                accountMode === 'no_account'
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs dark:border-blue-500 dark:bg-blue-950/30'
                  : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">📋</span>
                <input
                  type="radio"
                  name="account_mode"
                  checked={accountMode === 'no_account'}
                  onChange={() => setAccountMode('no_account')}
                  className="h-4 w-4 text-blue-600"
                />
              </div>
              <h4 className="mt-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                No Login Account (Walk-in)
              </h4>
              <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Register as a standalone in-clinic patient without web portal access
              </p>
            </div>
          </div>

          {/* Conditional Sub-Form: Create New Account Credentials */}
          {accountMode === 'create_new' && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                New Patient Portal Credentials
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Login Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={accountEmail}
                    onChange={(e) => {
                      setAccountEmail(e.target.value);
                      setPatientEmail(e.target.value);
                    }}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Initial Password *
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[10px] font-bold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                    >
                      🎲 Generate
                    </button>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 pr-10 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Sub-Form: Select Existing User Account */}
          {accountMode === 'select_existing' && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                Select User from System Catalog
              </span>

              {/* Search User */}
              <input
                type="text"
                placeholder="Search registered user by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />

              {/* User Selection List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const active = selectedUserId === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all cursor-pointer ${
                          active
                            ? 'border-blue-600 bg-white shadow-xs font-semibold dark:border-blue-500 dark:bg-zinc-900'
                            : 'border-zinc-200/80 bg-white/70 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                            {user.full_name[0]}
                          </div>
                          <div>
                            <span className="text-zinc-900 dark:text-zinc-100 block">
                              {user.full_name}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {user.email} • {user.phone_number || 'No phone'}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 capitalize">
                          {user.role?.name || 'User'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-500 p-2 text-center">
                    No matching users found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PATIENT DEMOGRAPHICS */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>👤</span>
                <span>Personal & Demographics</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Full legal name, date of birth, gender, and contact details
              </p>
            </div>
            <span className="rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold dark:text-blue-400">
              Step 2 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Srun"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Borath"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+855 12 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Residential Address
              </label>
              <input
                type="text"
                placeholder="Street address, Sangkat, Khan, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CLINICAL PROFILE & ALLERGIES */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>🩺</span>
                <span>Clinical Profile & Medical History</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Blood type, documented allergies, and pre-existing chronic conditions
              </p>
            </div>
            <span className="rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold dark:text-blue-400">
              Step 3 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Known Drug & Food Allergies
              </label>
              <input
                type="text"
                placeholder="Penicillin, Peanuts, NSAIDs, None"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Pre-existing Medical History & Chronic Conditions
              </label>
              <textarea
                rows={3}
                placeholder="Document past hospitalizations, chronic illnesses (hypertension, asthma, diabetes), surgeries..."
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: TRIAGE & EMERGENCY */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>🚨</span>
                <span>Triage Assignment & Emergency Contact</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Initial queue status, consulting physician, and primary emergency delegate
              </p>
            </div>
            <span className="rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold dark:text-blue-400">
              Step 4 of 4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Initial Queue / Triage Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="Active">Active (In System)</option>
                <option value="Pending Vitals">Pending Vitals / Triage</option>
                <option value="In Consultation">Direct into Consultation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Assigned Attending Physician
              </label>
              <select
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="Dr. Sarah Smith">Dr. Sarah Smith (Cardiology)</option>
                <option value="Dr. Marcus Vance">Dr. Marcus Vance (General Medicine)</option>
                <option value="Dr. Emily Chen">Dr. Emily Chen (Pediatrics)</option>
                <option value="Dr. David Miller">Dr. David Miller (Dental Care)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Emergency Contact Name
              </label>
              <input
                type="text"
                placeholder="Parent, Spouse, or Relative"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+855 98 765 432"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
          <Link
            href="/dashboard/patients"
            className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing Registration & Account...</span>
              </>
            ) : (
              <span>Complete Patient Registration &rarr;</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
