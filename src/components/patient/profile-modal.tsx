'use client';

import React, { useState } from 'react';
import { PatientProfile, PatientUpdatePayload } from '@/types/patient.type';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile | null;
  onSave: (updated: PatientProfile) => Promise<void>;
}

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileModalProps) {
  const [formData, setFormData] = useState<PatientUpdatePayload>({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone_number: profile?.phone_number || '',
    blood_group: profile?.blood_group || 'O+',
    allergies: profile?.allergies || '',
    medical_history: profile?.medical_history || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
    address: profile?.address || '',
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const merged: PatientProfile = {
        id: profile?.id || 'pat-1',
        first_name: formData.first_name || 'Patient',
        last_name: formData.last_name || 'User',
        phone_number: formData.phone_number,
        blood_group: formData.blood_group,
        allergies: formData.allergies,
        medical_history: formData.medical_history,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        address: formData.address,
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await onSave(merged);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Patient Clinical & Emergency Profile
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Update vital medical data for doctor reference during consultations
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Blood Group
              </label>
              <select
                value={formData.blood_group || 'O+'}
                onChange={(e) =>
                  setFormData({ ...formData, blood_group: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
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
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_number || ''}
                placeholder="+855 12 345 678"
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Known Drug & Food Allergies
            </label>
            <input
              type="text"
              value={formData.allergies || ''}
              placeholder="e.g. Penicillin, Aspirin, Peanuts, None"
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Pre-existing Medical History & Conditions
            </label>
            <textarea
              rows={2}
              value={formData.medical_history || ''}
              placeholder="e.g. Mild Asthma, Hypertension, past surgeries..."
              onChange={(e) =>
                setFormData({ ...formData, medical_history: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergency_contact_name || ''}
                placeholder="Parent, Spouse or Relative"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_name: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergency_contact_phone || ''}
                placeholder="+855 98 765 432"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact_phone: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Health Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
