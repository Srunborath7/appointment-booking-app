'use client';

import React, { useState, useEffect } from 'react';
import { Room, RoomCreatePayload } from '@/types/room.type';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: Room | null;
  onSave: (payload: RoomCreatePayload, id?: string) => Promise<void>;
}

export function RoomModal({
  isOpen,
  onClose,
  roomToEdit,
  onSave,
}: RoomModalProps) {
  const [formData, setFormData] = useState<RoomCreatePayload>({
    room_number: '',
    name: '',
    room_type: 'consultation',
    department: 'General Medicine',
    floor: '1st Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'available',
    description: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roomToEdit) {
      setFormData({
        room_number: roomToEdit.room_number,
        name: roomToEdit.name,
        room_type: roomToEdit.room_type,
        department: roomToEdit.department || 'General Medicine',
        floor: roomToEdit.floor || '1st Floor',
        building: roomToEdit.building || 'Central Clinic Pavilion',
        capacity: roomToEdit.capacity || 1,
        status: roomToEdit.status || 'available',
        description: roomToEdit.description || '',
        is_active: roomToEdit.is_active ?? true,
      });
    } else {
      setFormData({
        room_number: '',
        name: '',
        room_type: 'consultation',
        department: 'General Medicine',
        floor: '1st Floor',
        building: 'Central Clinic Pavilion',
        capacity: 1,
        status: 'available',
        description: '',
        is_active: true,
      });
    }
  }, [roomToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.room_number.trim() || !formData.name.trim()) {
      alert('Room Number and Room Name are required.');
      return;
    }
    setSubmitting(true);
    try {
      await onSave(formData, roomToEdit?.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {roomToEdit ? 'Edit Clinic Room' : 'Add New Clinic Room'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Configure room number, department, and 3D floor placement
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Room Number / Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. R-101, Suite A"
                value={formData.room_number}
                onChange={(e) =>
                  setFormData({ ...formData, room_number: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Room Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Consultation Suite 1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Floor (3D Level)
              </label>
              <select
                value={formData.floor || '1st Floor'}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="1st Floor">1st Floor (Lobby & Triage)</option>
                <option value="2nd Floor">2nd Floor (Consultation Suites)</option>
                <option value="3rd Floor">3rd Floor (Specialist & Surgery)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Clinical Department
              </label>
              <select
                value={formData.department || 'General Medicine'}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dental Care">Dental Care</option>
                <option value="Triage & Emergency">Triage & Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Room Category
              </label>
              <select
                value={formData.room_type}
                onChange={(e) =>
                  setFormData({ ...formData, room_type: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="consultation">Consultation Room</option>
                <option value="examination">Examination Suite</option>
                <option value="surgery">Surgery / Operation</option>
                <option value="triage">Triage Station</option>
                <option value="dental">Dental Suite</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Capacity (Persons)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.capacity || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Availability Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="available">🟢 Available</option>
              <option value="consultation">🔵 In Consultation</option>
              <option value="occupied">🔴 Occupied</option>
              <option value="maintenance">🟡 Cleaning / Maintenance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Equipment & Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="ECG monitor, Ultrasound machine, Dental chair..."
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
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
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : roomToEdit ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
