'use client';

import React, { useState, useEffect } from 'react';
import { Appointment, Doctor } from '@/types/patient.type';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedDoctor?: Doctor | null;
  onBookSuccess: (appointment: Appointment) => void;
}

const DEPARTMENTS = [
  { id: 'gen', name: 'General Medicine', icon: '🩺' },
  { id: 'cardio', name: 'Cardiology', icon: '❤️' },
  { id: 'pedia', name: 'Pediatrics', icon: '👶' },
  { id: 'dental', name: 'Dental Care', icon: '🦷' },
  { id: 'derma', name: 'Dermatology', icon: '🧴' },
  { id: 'ortho', name: 'Orthopedics', icon: '🦴' },
];

const SAMPLE_DOCTORS: Doctor[] = [
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

const TIME_SLOTS = [
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:30 AM',
  '11:00 AM',
  '01:30 PM',
  '02:00 PM',
  '03:00 PM',
  '03:30 PM',
  '04:30 PM',
];

export function BookingModal({
  isOpen,
  onClose,
  preSelectedDoctor,
  onBookSuccess,
}: BookingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<string>('General Medicine');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-13');
  const [selectedTime, setSelectedTime] = useState<string>('09:30 AM');
  const [reason, setReason] = useState<string>('Routine General Consultation');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (preSelectedDoctor) {
      setSelectedDoctor(preSelectedDoctor);
      setSelectedDept(preSelectedDoctor.department);
      setStep(3); // Jump directly to slot selection
    } else {
      setStep(1);
      setSelectedDoctor(SAMPLE_DOCTORS[0]);
    }
  }, [preSelectedDoctor, isOpen]);

  if (!isOpen) return null;

  const filteredDoctors = SAMPLE_DOCTORS.filter(
    (d) => !selectedDept || d.department.toLowerCase() === selectedDept.toLowerCase()
  );

  const handleConfirmBooking = () => {
    if (!selectedDoctor) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking: Appointment = {
        id: `apt-${Date.now()}`,
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        doctor_specialty: selectedDoctor.specialty,
        department: selectedDoctor.department,
        date: selectedDate,
        time: selectedTime,
        status: 'confirmed',
        reason: reason || 'General Checkup',
        room: `Room ${Math.floor(Math.random() * 20) + 101}`,
        notes,
      };

      onBookSuccess(newBooking);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Book Doctor Consultation
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Step {step} of 4 — {step === 1 && 'Select Specialty'}
              {step === 2 && 'Choose Doctor'}
              {step === 3 && 'Choose Date & Time'}
              {step === 4 && 'Confirm Details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6">
          {/* Step 1: Department */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Choose Medical Department
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {DEPARTMENTS.map((dept) => {
                  const active = selectedDept === dept.name;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept.name)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-2xl">{dept.icon}</span>
                      <span className="mt-2 text-xs font-semibold">
                        {dept.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Choose Doctor */}
          {step === 2 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Select Doctor in {selectedDept}
              </label>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {(filteredDoctors.length > 0 ? filteredDoctors : SAMPLE_DOCTORS).map(
                  (doc) => {
                    const active = selectedDoctor?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all cursor-pointer ${
                          active
                            ? 'border-blue-600 bg-blue-50/60 shadow-xs dark:border-blue-500 dark:bg-blue-950/40'
                            : 'border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                            {doc.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {doc.name}
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {doc.specialty}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {doc.fee}
                          </div>
                          <div className="text-[10px] text-amber-500">
                            ★ {doc.rating}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Appointment Date
                </label>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {[
                    { label: 'Today', date: '2026-11-12' },
                    { label: 'Tomorrow', date: '2026-11-13' },
                    { label: 'Saturday', date: '2026-11-14' },
                    { label: 'Monday', date: '2026-11-16' },
                  ].map((d) => {
                    const active = selectedDate === d.date;
                    return (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`flex-1 min-w-[90px] rounded-xl border py-2.5 text-center text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        <div>{d.label}</div>
                        <div className="text-[10px] opacity-80">{d.date.slice(5)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Time Slot
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {(selectedDoctor?.slots || TIME_SLOTS).map((slot) => {
                    const active = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-xl border py-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                            : 'border-zinc-200/80 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Reason & Confirmation */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-xs">
                    {selectedDoctor?.avatar || 'MD'}
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 dark:text-blue-100">
                      {selectedDoctor?.name}
                    </h4>
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      {selectedDoctor?.specialty} • {selectedDoctor?.fee}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      📅 {selectedDate} at ⏰ {selectedTime}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Primary Reason for Visit
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-800 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <option value="Routine General Consultation">Routine General Consultation</option>
                  <option value="Fever, Cold or Respiratory Symptoms">Fever, Cold or Respiratory Symptoms</option>
                  <option value="Chest Pain or Heart Rate Concerns">Chest Pain or Heart Rate Concerns</option>
                  <option value="Dental Checkup or Toothache">Dental Checkup or Toothache</option>
                  <option value="Pediatric Wellness Checkup">Pediatric Wellness Checkup</option>
                  <option value="Skin Rash or Allergy">Skin Rash or Allergy</option>
                  <option value="Follow-up Appointment">Follow-up Appointment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Additional Symptoms / Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Describe any symptoms or specific requests for the doctor..."
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/30">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 cursor-pointer"
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming Appointment...' : 'Book & Confirm Appointment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
