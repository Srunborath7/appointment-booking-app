'use client';

import React from 'react';
import { Doctor } from '@/types/patient.type';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all hover:border-blue-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-blue-500/40">
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-base font-bold text-white shadow-md shadow-blue-500/20">
            {doctor.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-zinc-900 truncate dark:text-zinc-50">
                {doctor.name}
              </h4>
              <span className="shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-emerald-400">
                Available
              </span>
            </div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {doctor.specialty}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {doctor.department}
            </p>
          </div>
        </div>

        {/* Rating and Consultation Fee */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
          <div>
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <span className="text-amber-500">★</span>
              <span>{doctor.rating}</span>
            </div>
            <span className="text-[10px] text-zinc-400">
              {doctor.reviews_count} reviews
            </span>
          </div>
          <div className="border-l border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {doctor.fee}
            </div>
            <span className="text-[10px] text-zinc-400">Consultation</span>
          </div>
        </div>

        {/* Available Schedule tags */}
        <div className="mt-3.5">
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            Weekly Schedule:
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {doctor.available_days.map((day) => (
              <span
                key={day}
                className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => onSelect(doctor)}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-500 active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Book Consultation</span>
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
