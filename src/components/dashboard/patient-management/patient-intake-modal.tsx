'use client';

import React, { useState, useEffect } from 'react';
import { PatientCreatePayload, PatientProfile } from '@/types/patient.type';

interface PatientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: PatientProfile | null;
  onSave: (payload: PatientCreatePayload, id?: string) => Promise<void>;
}

export function PatientIntakeModal({
  isOpen,
  onClose,
  patientToEdit,
  onSave,
}: PatientIntakeModalProps) {
  const [formData, setFormData] = useState<PatientCreatePayload>({
    first_name: '',
    last_name: '',
    date_of_birth: '1995-06-15',
    gender: 'Male',
    phone_number: '',
    email: '',
    address: '',
    blood_group: 'O+',
    allergies: '',
    medical_history: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    status: 'Active',
    assigned_doctor: 'Dr. Sarah Smith',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        first_name: patientToEdit.first_name,
        last_name: patientToEdit.last_name,
        date_of_birth: patientToEdit.date_of_birth || '1995-06-15',
        gender: patientToEdit.gender || 'Male',
        phone_number: patientToEdit.phone_number || '',
        email: patientToEdit.email || '',
        address: patientToEdit.address || '',
        blood_group: patientToEdit.blood_group || 'O+',
        allergies: patientToEdit.allergies || '',
        medical_history: patientToEdit.medical_history || '',
        emergency_contact_name: patientToEdit.emergency_contact_name || '',
        emergency_contact_phone: patientToEdit.emergency_contact_phone || '',
        status: patientToEdit.status || 'Active',
        assigned_doctor: patientToEdit.assigned_doctor || 'Dr. Sarah Smith',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '1995-06-15',
        gender: 'Male',
        phone_number: '',
        email: '',
        address: '',
        blood_group: 'O+',
        allergies: '',
        medical_history: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        status: 'Active',
        assigned_doctor: 'Dr. Sarah Smith',
      });
    }
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      alert('First Name and Last Name are required.');
      return;
    }
    setSubmitting(true);
    try {
      await onSave(formData, patientToEdit?.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {patientToEdit ? 'Edit Patient Record' : 'Register New Patient'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {patientToEdit
                ? `Updating ID: #${patientToEdit.id}`
                : 'Enter patient personal data, medical profile, and triage assignment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Personal Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5">
              1. Demographics & Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srun"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
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
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5">
              2. Contact & Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+855 12 345 678"
                  value={formData.phone_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Street address, Khan, Sangkat, City"
                  value={formData.address || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Clinical Profile */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5">
              3. Clinical Indicators & History
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Blood Group
                </label>
                <select
                  value={formData.blood_group || 'O+'}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_group: e.target.value })
                  }
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
                  placeholder="Penicillin, NSAIDs, Peanuts..."
                  value={formData.allergies || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Documented Medical History & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Hypertension, Asthma, Past Surgeries..."
                  value={formData.medical_history || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, medical_history: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Triage & Emergency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5">
              4. Clinic Status & Emergency
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Triage / Queue Status
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="Active">Active (In System)</option>
                  <option value="In Consultation">In Consultation</option>
                  <option value="Pending Vitals">Pending Vitals / Triage</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Assigned Physician
                </label>
                <select
                  value={formData.assigned_doctor || 'Dr. Sarah Smith'}
                  onChange={(e) =>
                    setFormData({ ...formData, assigned_doctor: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="Dr. Sarah Smith">Dr. Sarah Smith (Cardiology)</option>
                  <option value="Dr. Marcus Vance">Dr. Marcus Vance (General)</option>
                  <option value="Dr. Emily Chen">Dr. Emily Chen (Pediatrics)</option>
                  <option value="Dr. David Miller">Dr. David Miller (Dental)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  placeholder="Relative or Guardian name"
                  value={formData.emergency_contact_name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact_name: e.target.value,
                    })
                  }
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
                  value={formData.emergency_contact_phone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact_phone: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving Record...' : patientToEdit ? 'Save Changes' : 'Complete Intake'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
