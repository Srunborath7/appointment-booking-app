'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PatientCreatePayload, PatientProfile } from '@/types/patient.type';
import { patientApi } from '@/services/patient/patient.api';
import { PatientIntakeModal } from '@/components/dashboard/patient-management/patient-intake-modal';
import { PatientDetailsDrawer } from '@/components/dashboard/patient-management/patient-details-drawer';

const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-101',
    patient_number: 'PT-10491',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'Male',
    date_of_birth: '1988-04-12',
    phone_number: '+855 12 345 678',
    email: 'john.doe@gmail.com',
    address: 'St 214, Daun Penh, Phnom Penh',
    blood_group: 'O+',
    allergies: 'Penicillin, Cephalosporins',
    medical_history: 'Hypertension Stage 1, managed with lifestyle modifications',
    emergency_contact_name: 'Mary Doe (Spouse)',
    emergency_contact_phone: '+855 12 999 888',
    status: 'In Consultation',
    assigned_doctor: 'Dr. Sarah Smith',
    last_visit: 'Today, 09:00 AM',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-11-12T09:00:00Z',
  },
  {
    id: 'pat-102',
    patient_number: 'PT-10492',
    first_name: 'Alice',
    last_name: 'Johnson',
    gender: 'Female',
    date_of_birth: '1992-09-24',
    phone_number: '+855 89 223 344',
    email: 'alice.j@yahoo.com',
    address: 'BKK1, Khan Boeung Keng Kang, Phnom Penh',
    blood_group: 'A+',
    allergies: 'None recorded',
    medical_history: 'Seasonal Allergic Rhinitis',
    emergency_contact_name: 'David Johnson (Brother)',
    emergency_contact_phone: '+855 89 555 666',
    status: 'Pending Vitals',
    assigned_doctor: 'Dr. Marcus Vance',
    last_visit: 'Today, 09:30 AM',
    created_at: '2026-02-14T08:00:00Z',
    updated_at: '2026-11-12T09:30:00Z',
  },
  {
    id: 'pat-103',
    patient_number: 'PT-10493',
    first_name: 'Michael',
    last_name: 'Brown',
    gender: 'Male',
    date_of_birth: '1975-12-05',
    phone_number: '+855 77 881 122',
    email: 'mbrown@outlook.com',
    address: 'Toul Kork, Phnom Penh',
    blood_group: 'B+',
    allergies: 'Aspirin, NSAIDs',
    medical_history: 'Type 2 Diabetes Mellitus, Mild Asthma',
    emergency_contact_name: 'Susan Brown (Wife)',
    emergency_contact_phone: '+855 77 334 455',
    status: 'Active',
    assigned_doctor: 'Dr. Sarah Smith',
    last_visit: 'Yesterday',
    created_at: '2025-11-20T08:00:00Z',
    updated_at: '2026-11-11T14:00:00Z',
  },
  {
    id: 'pat-104',
    patient_number: 'PT-10494',
    first_name: 'Emma',
    last_name: 'Wilson',
    gender: 'Female',
    date_of_birth: '2001-07-19',
    phone_number: '+855 96 445 566',
    email: 'emma.wilson@icloud.com',
    address: 'Sen Sok, Phnom Penh',
    blood_group: 'O-',
    allergies: 'Peanuts, Shellfish',
    medical_history: 'No known chronic conditions',
    emergency_contact_name: 'Robert Wilson (Father)',
    emergency_contact_phone: '+855 96 112 233',
    status: 'Discharged',
    assigned_doctor: 'Dr. David Miller',
    last_visit: '3 days ago',
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-11-09T11:00:00Z',
  },
  {
    id: 'pat-105',
    patient_number: 'PT-10495',
    first_name: 'David',
    last_name: 'Lee',
    gender: 'Male',
    date_of_birth: '2015-03-10',
    phone_number: '+855 10 778 899',
    email: 'lee.family@gmail.com',
    address: 'Chroy Changvar, Phnom Penh',
    blood_group: 'AB+',
    allergies: 'Latex',
    medical_history: 'Childhood Asthma, routine immunization up to date',
    emergency_contact_name: 'Jennifer Lee (Mother)',
    emergency_contact_phone: '+855 10 999 111',
    status: 'Pending Vitals',
    assigned_doctor: 'Dr. Emily Chen',
    last_visit: 'Today, 10:45 AM',
    created_at: '2026-04-18T08:00:00Z',
    updated_at: '2026-11-12T10:45:00Z',
  },
];

function PatientsManagementContent() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<PatientProfile[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bloodFilter, setBloodFilter] = useState('All');

  // Modals state
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<PatientProfile | null>(null);
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<PatientProfile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check URL query action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsIntakeOpen(true);
    }
  }, [searchParams]);

  // Load backend patients if available
  useEffect(() => {
    async function loadData() {
      try {
        const res = await patientApi.listPatients(1, 50);
        if (res && res.items && res.items.length > 0) {
          // Merge with sample records
          setPatients(res.items);
        }
      } catch (err) {
        console.warn('Backend patient sync skipped, using local clinical records:', err);
      }
    }
    loadData();
  }, []);

  const handleCreateOrUpdate = async (payload: PatientCreatePayload, id?: string) => {
    if (id) {
      // Update existing
      try {
        await patientApi.updatePatient(id, payload);
      } catch (e) {
        console.warn('API update fallback:', e);
      }
      setPatients((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...payload,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
      if (selectedPatientForDrawer?.id === id) {
        setSelectedPatientForDrawer((prev) => (prev ? { ...prev, ...payload } : null));
      }
    } else {
      // Create new
      let createdId = `pat-${Date.now()}`;
      try {
        const res = await patientApi.createPatient(payload);
        if (res && res.id) createdId = res.id;
      } catch (e) {
        console.warn('API create fallback:', e);
      }

      const newRecord: PatientProfile = {
        id: createdId,
        patient_number: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPatients((prev) => [newRecord, ...prev]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete patient record "${name}"? This action cannot be undone.`)) {
      try {
        await patientApi.deletePatient(id);
      } catch (e) {
        console.warn('API delete fallback:', e);
      }
      setPatients((prev) => prev.filter((p) => p.id !== id));
      if (selectedPatientForDrawer?.id === id) {
        setIsDrawerOpen(false);
      }
    }
  };

  const handleOpenEdit = (patient: PatientProfile) => {
    setPatientToEdit(patient);
    setIsIntakeOpen(true);
  };

  const handleOpenDrawer = (patient: PatientProfile) => {
    setSelectedPatientForDrawer(patient);
    setIsDrawerOpen(true);
  };

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      (p.phone_number && p.phone_number.includes(query)) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.patient_number && p.patient_number.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesBlood = bloodFilter === 'All' || p.blood_group === bloodFilter;

    return matchesSearch && matchesStatus && matchesBlood;
  });

  // Metric counts
  const totalCount = patients.length;
  const inConsultationCount = patients.filter((p) => p.status === 'In Consultation').length;
  const pendingVitalsCount = patients.filter((p) => p.status === 'Pending Vitals').length;
  const allergyAlertCount = patients.filter((p) => p.allergies && p.allergies.toLowerCase() !== 'none' && p.allergies.trim() !== '').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Patients
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Patient Directory & Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Comprehensive clinical records, patient intake, triage status, and health histories
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const headers = ['Patient ID', 'Name', 'Gender', 'Phone', 'Email', 'Blood Group', 'Status', 'Doctor'];
              const rows = patients.map((p) => [
                p.patient_number || p.id,
                `"${p.first_name} ${p.last_name}"`,
                p.gender || '',
                p.phone_number || '',
                p.email || '',
                p.blood_group || '',
                p.status || 'Active',
                `"${p.assigned_doctor || ''}"`,
              ]);
              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `patients_export_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>

          <Link
            href="/dashboard/patients/new"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>+ Register New Patient</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Registered Patients</span>
            <span className="text-base">👥</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {totalCount}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              +12% this month
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Active medical profiles</p>
        </div>

        {/* In Consultation */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">In Consultation Now</span>
            <span className="text-base">🩺</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {inConsultationCount}
            </span>
            <span className="text-[10px] font-semibold text-blue-500">
              Active in suites
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Doctor sessions in progress</p>
        </div>

        {/* Pending Vitals */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Pending Triage / Vitals</span>
            <span className="text-base">⏳</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {pendingVitalsCount}
            </span>
            <span className="text-[10px] font-semibold text-amber-500">
              Nurse queue
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Awaiting BP & temperature check</p>
        </div>

        {/* Allergy Alerts */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Documented Allergies</span>
            <span className="text-base">⚠️</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {allergyAlertCount}
            </span>
            <span className="text-[10px] font-semibold text-rose-500">
              Safety alerts
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Requires prescription caution</p>
        </div>
      </div>

      {/* Search, Filter, and Bulk Actions Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/80">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search patient name, phone, email, or PT-ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 pl-9 text-xs text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
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

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Pending Vitals">Pending Vitals</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          {/* Blood Group Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 text-[11px]">Blood:</span>
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="All">All Groups</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Data Table */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-zinc-400 uppercase tracking-wider text-[10px] dark:border-zinc-800/80 dark:bg-zinc-950/40">
                <th className="py-3 px-4 font-bold">Patient</th>
                <th className="py-3 px-4 font-bold">Demographics</th>
                <th className="py-3 px-4 font-bold">Contact</th>
                <th className="py-3 px-4 font-bold">Clinical Indicators</th>
                <th className="py-3 px-4 font-bold">Triage Status</th>
                <th className="py-3 px-4 font-bold">Assigned Doctor</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-600 dark:text-zinc-300">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const initials = `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase();
                  const statusColors: Record<string, string> = {
                    'In Consultation': 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
                    'Pending Vitals': 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
                    Active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
                    Discharged: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 dark:text-zinc-400',
                  };

                  return (
                    <tr
                      key={patient.id}
                      className="group transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                    >
                      {/* Patient Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <span
                              onClick={() => handleOpenDrawer(patient)}
                              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer block"
                            >
                              {patient.first_name} {patient.last_name}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {patient.patient_number || `#PT-${patient.id.slice(0, 5)}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {patient.gender || '—'}
                          </span>
                          <span className="text-[11px] text-zinc-400 block">
                            DOB: {patient.date_of_birth || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {patient.phone_number || '—'}
                          </span>
                          <span className="text-[11px] text-zinc-400 block truncate max-w-[150px]">
                            {patient.email || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Clinical Indicators */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold dark:text-rose-400">
                            Blood: {patient.blood_group || 'O+'}
                          </span>
                          {patient.allergies && patient.allergies.toLowerCase() !== 'none' ? (
                            <span className="block text-[10px] font-semibold text-amber-600 dark:text-amber-400 truncate max-w-[150px]" title={patient.allergies}>
                              ⚠️ {patient.allergies}
                            </span>
                          ) : (
                            <span className="block text-[10px] text-zinc-400">
                              No known allergies
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Triage Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                            statusColors[patient.status || 'Active'] || statusColors.Active
                          }`}
                        >
                          ● {patient.status || 'Active'}
                        </span>
                      </td>

                      {/* Assigned Doctor */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {patient.assigned_doctor || 'Dr. Sarah Smith'}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">
                          Last: {patient.last_visit || 'Recent'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDrawer(patient)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition-colors cursor-pointer"
                            title="View Medical Profile"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(patient)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-amber-600 dark:hover:bg-zinc-800 dark:hover:text-amber-400 transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDelete(patient.id, `${patient.first_name} ${patient.last_name}`)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="text-3xl">👥</div>
                    <p className="mt-2 text-xs font-semibold">No patients match your search or filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-950/30">
          <span>
            Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patients
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 disabled:opacity-40">
              Previous
            </button>
            <span className="px-2 text-xs font-bold text-blue-600">1</span>
            <button className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Patient Intake / Edit Modal */}
      <PatientIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => {
          setIsIntakeOpen(false);
          setPatientToEdit(null);
        }}
        patientToEdit={patientToEdit}
        onSave={handleCreateOrUpdate}
      />

      {/* Slide-out Patient Details Drawer */}
      <PatientDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        patient={selectedPatientForDrawer}
        onEdit={(p) => {
          setIsDrawerOpen(false);
          handleOpenEdit(p);
        }}
      />
    </div>
  );
}

export default function PatientsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading Patient Directory...</span>
          </div>
        </div>
      }
    >
      <PatientsManagementContent />
    </Suspense>
  );
}
