'use client';

import React from 'react';
import { Room } from '@/types/room.type';

interface RoomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onEdit: (room: Room) => void;
  onStatusChange: (room: Room, newStatus: string) => Promise<void>;
  onDelete: (room: Room) => void;
}

export function RoomDrawer({
  isOpen,
  onClose,
  room,
  onEdit,
  onStatusChange,
  onDelete,
}: RoomDrawerProps) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Clinic Room Details
              </span>
              <span className="rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold dark:text-blue-400">
                {room.room_number}
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
            {/* Top Room Banner */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                    {room.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {room.department || 'General Care'} • {room.floor || '1st Floor'}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                    room.status === 'available'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : room.status === 'occupied'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  ● {room.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Quick Status Control Buttons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Quick Status Switch
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onStatusChange(room, 'available')}
                  className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                    room.status === 'available'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  🟢 Available
                </button>
                <button
                  onClick={() => onStatusChange(room, 'consultation')}
                  className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                    room.status === 'consultation'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  🔵 In Session
                </button>
                <button
                  onClick={() => onStatusChange(room, 'maintenance')}
                  className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                    room.status === 'maintenance'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  🟡 Cleaning
                </button>
              </div>
            </div>

            {/* Room Specifications */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Facility & Capacity
              </h4>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Room Category:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                    {room.room_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Department:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {room.department || 'General Care'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Floor Level:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {room.floor || '1st Floor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Building / Wing:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {room.building || 'Central Clinic Pavilion'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Patient Capacity:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {room.capacity} Person(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Equipment & Facilities Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Equipment & Notes
              </h4>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300 leading-relaxed">
                {room.description ||
                  'Fully equipped clinical consultation room with digital vital signs monitor, examination bed, and doctor workstation.'}
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="border-t border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 flex items-center gap-2">
            <button
              onClick={() => onEdit(room)}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-500 cursor-pointer text-center"
            >
              ✏️ Edit Room
            </button>
            <button
              onClick={() => onDelete(room)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 cursor-pointer"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
