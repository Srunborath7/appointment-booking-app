'use client';

import React from 'react';
import { PatientProfile } from '@/types/patient.type';

interface PatientDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile | null;
  onEdit: (patient: PatientProfile) => void;
}

export function PatientDetailsDrawer({
  isOpen,
  onClose,
  patient,
  onEdit,
}: PatientDetailsDrawerProps) {
  if (!isOpen || !patient) return null;

  const initials = `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Patient Medical Record
              </span>
              <span className="rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-blue-400">
                {patient.patient_number || `#PT-${patient.id.slice(0, 6)}`}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Identity Card */}
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/50">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md shadow-blue-500/20">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base truncate">
                    {patient.first_name} {patient.last_name}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {patient.gender || 'Not specified'} • DOB: {patient.date_of_birth || '—'}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold dark:text-emerald-400">
                    {patient.status || 'Active'}
                  </span>
                  <span className="rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold dark:text-rose-400">
                    Blood: {patient.blood_group || 'O+'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Vital Signs Strip */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Recent Clinical Vitals
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <span className="text-[10px] text-zinc-400">Blood Pressure</span>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">120/80 mmHg</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <span className="text-[10px] text-zinc-400">Heart Rate</span>
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">74 bpm</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <span className="text-[10px] text-zinc-400">Oxygen (SpO2)</span>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">99%</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <span className="text-[10px] text-zinc-400">Body Temp</span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">36.7 °C</p>
                </div>
              </div>
            </div>

            {/* Allergy & Safety Alert */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                <span>⚠️</span>
                <span>Documented Allergies & Drug Warnings</span>
              </div>
              <p className="mt-1 text-xs font-medium text-amber-800 dark:text-amber-400">
                {patient.allergies || 'No adverse drug or food allergies on file.'}
              </p>
            </div>

            {/* Medical History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Pre-existing Conditions & Notes
              </h4>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-xs text-zinc-700 leading-relaxed dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                {patient.medical_history || 'No chronic medical issues recorded.'}
              </div>
            </div>

            {/* Assigned Doctor & Triage */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Clinical Care Team
              </h4>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3.5 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {patient.assigned_doctor || 'Dr. Sarah Smith'}
                  </p>
                  <span className="text-[11px] text-zinc-500">Primary Consulting Physician</span>
                </div>
                <span className="rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-1 text-[10px] font-semibold dark:text-blue-400">
                  {patient.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Emergency Notification Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Emergency Contact
              </h4>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                  {patient.emergency_contact_name || 'Not specified'}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  {patient.emergency_contact_phone || '—'}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Contact & Address
              </h4>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-2 text-xs dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Phone:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {patient.phone_number || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Email:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {patient.email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Address:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {patient.address || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="border-t border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 flex items-center gap-2">
            <button
              onClick={() => onEdit(patient)}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-500 cursor-pointer text-center"
            >
              ✏️ Edit Record
            </button>
            <button
              onClick={() => {
                alert(`Appointment booking dialog launched for ${patient.first_name} ${patient.last_name}`);
              }}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer text-center"
            >
              🗓️ Book Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
