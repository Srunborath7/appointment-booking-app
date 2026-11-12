'use client';

import React from 'react';
import { Appointment } from '@/types/patient.type';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  onCancel,
  onReschedule,
}: AppointmentCardProps) {
  const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'pending';

  const statusColors = {
    confirmed:
      'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    pending:
      'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    completed:
      'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    cancelled:
      'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  };

  return (
    <div className="group relative rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Doctor & Specialty Info */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xs">
            {appointment.doctor_name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {appointment.doctor_name}
              </h4>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${
                  statusColors[appointment.status] || statusColors.pending
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {appointment.doctor_specialty} • {appointment.department}
            </p>
            {appointment.room && (
              <p className="mt-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                📍 {appointment.room}
              </p>
            )}
          </div>
        </div>

        {/* Date & Time Slot Pill */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            <svg
              className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{appointment.date}</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <svg
              className="h-3 w-3 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>

      {/* Reason for Visit */}
      {appointment.reason && (
        <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-zinc-400">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Reason for visit:
          </span>{' '}
          {appointment.reason}
        </div>
      )}

      {/* Card Actions */}
      {isUpcoming && (
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
          {onReschedule && (
            <button
              onClick={() => onReschedule(appointment.id)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
            >
              Reschedule
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
