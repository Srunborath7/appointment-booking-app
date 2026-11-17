'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Room, RoomCreatePayload } from '@/types/room.type';
import { roomApi } from '@/services/room/room.api';
import { Building3DViewer } from '@/components/dashboard/rooms/building-3d-viewer';
import { RoomDrawer } from '@/components/dashboard/rooms/room-drawer';
import { RoomModal } from '@/components/dashboard/rooms/room-modal';

const INITIAL_ROOMS: Room[] = [
  // 1st Floor
  {
    id: 'rm-101',
    room_number: 'R-101',
    name: 'Triage & Intake Station A',
    room_type: 'triage',
    department: 'Triage & Emergency',
    floor: '1st Floor',
    building: 'Central Clinic Pavilion',
    capacity: 2,
    status: 'available',
    description: 'Rapid intake station equipped with automatic BP cuff, pulse oximeter, and digital scale.',
    is_active: true,
  },
  {
    id: 'rm-102',
    room_number: 'R-102',
    name: 'Urgent Assessment Room',
    room_type: 'examination',
    department: 'Triage & Emergency',
    floor: '1st Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'consultation',
    description: 'Emergency trauma & rapid triage examination bay.',
    is_active: true,
  },
  {
    id: 'rm-103',
    room_number: 'R-103',
    name: 'Clinical Pharmacy Dispense',
    room_type: 'examination',
    department: 'General Medicine',
    floor: '1st Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'available',
    description: 'Pharmaceutical medication check & patient consultation booth.',
    is_active: true,
  },

  // 2nd Floor
  {
    id: 'rm-201',
    room_number: 'R-201',
    name: 'General Consultation Suite 1',
    room_type: 'consultation',
    department: 'General Medicine',
    floor: '2nd Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'consultation',
    description: 'Primary care doctor consultation room with diagnostic bed and workstation.',
    is_active: true,
  },
  {
    id: 'rm-202',
    room_number: 'R-202',
    name: 'Pediatrics Wellness Room',
    room_type: 'consultation',
    department: 'Pediatrics',
    floor: '2nd Floor',
    building: 'Central Clinic Pavilion',
    capacity: 2,
    status: 'available',
    description: 'Child-friendly examination suite with pediatric growth monitoring tools.',
    is_active: true,
  },
  {
    id: 'rm-203',
    room_number: 'R-203',
    name: 'Clinical Examination Room B',
    room_type: 'examination',
    department: 'General Medicine',
    floor: '2nd Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'maintenance',
    description: 'Sanitization and sterilization in progress following procedure.',
    is_active: true,
  },

  // 3rd Floor
  {
    id: 'rm-301',
    room_number: 'R-301',
    name: 'Cardiology Specialist Suite',
    room_type: 'consultation',
    department: 'Cardiology',
    floor: '3rd Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'available',
    description: 'Equipped with 12-lead ECG monitor, Holter analysis station, and echocardiogram.',
    is_active: true,
  },
  {
    id: 'rm-302',
    room_number: 'R-302',
    name: 'Dental Operatory Suite A',
    room_type: 'dental',
    department: 'Dental Care',
    floor: '3rd Floor',
    building: 'Central Clinic Pavilion',
    capacity: 1,
    status: 'consultation',
    description: 'Complete dental surgical chair with intraoral 3D scanner and panoramic X-ray link.',
    is_active: true,
  },
  {
    id: 'rm-303',
    room_number: 'R-303',
    name: 'Day Surgery & Minor Procedures',
    room_type: 'surgery',
    department: 'Cardiology',
    floor: '3rd Floor',
    building: 'Central Clinic Pavilion',
    capacity: 2,
    status: 'occupied',
    description: 'Sterile surgical suite with cardiac telemetry monitoring and anesthesia support.',
    is_active: true,
  },
];

function RoomsManagementContent() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [viewStyle, setViewStyle] = useState<'3d' | 'table'>('3d');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  // Sync with API
  useEffect(() => {
    async function fetchBackendRooms() {
      try {
        const res = await roomApi.listRooms(1, 50);
        if (res && res.items && res.items.length > 0) {
          // Merge API rooms with initial 3D sample rooms
          setRooms(res.items);
        }
      } catch (err) {
        console.warn('Backend room sync skipped, using local room dataset:', err);
      }
    }
    fetchBackendRooms();
  }, []);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setRoomToEdit(room);
    setIsDrawerOpen(false);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setRoomToEdit(null);
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (payload: RoomCreatePayload, id?: string) => {
    if (id) {
      try {
        await roomApi.updateRoom(id, payload);
      } catch (e) {
        console.warn('API update fallback:', e);
      }
      setRooms((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...payload, updated_at: new Date().toISOString() } : r
        )
      );
      if (selectedRoom?.id === id) {
        setSelectedRoom((prev) => (prev ? { ...prev, ...payload } : null));
      }
    } else {
      let createdId = `rm-${Date.now()}`;
      try {
        const res = await roomApi.createRoom(payload);
        if (res && res.id) createdId = res.id;
      } catch (e) {
        console.warn('API create fallback:', e);
      }

      const newRoom: Room = {
        id: createdId,
        ...payload,
        is_active: payload.is_active ?? true,
        capacity: payload.capacity || 1,
        status: payload.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRooms((prev) => [newRoom, ...prev]);
    }
  };

  const handleStatusChange = async (room: Room, newStatus: string) => {
    try {
      await roomApi.updateRoom(room.id, { status: newStatus });
    } catch (e) {
      console.warn('API status change fallback:', e);
    }
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r))
    );
    setSelectedRoom((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleDeleteRoom = async (room: Room) => {
    if (confirm(`Are you sure you want to delete "${room.room_number}: ${room.name}"?`)) {
      try {
        await roomApi.deleteRoom(room.id);
      } catch (e) {
        console.warn('API delete fallback:', e);
      }
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      setIsDrawerOpen(false);
      setSelectedRoom(null);
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.room_number.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.department && r.department.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = deptFilter === 'All' || r.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Metrics
  const totalCount = rooms.length;
  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const inConsultationCount = rooms.filter(
    (r) => r.status === 'consultation' || r.status === 'in_consultation'
  ).length;
  const maintenanceCount = rooms.filter((r) => r.status === 'maintenance').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Facility & 3D Rooms
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Clinical Facility & 3D Building
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Interactive multi-floor 3D hospital visualizer, room status telemetry, and clinical suite management
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* 3D vs Table Switch */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-1 text-xs shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => setViewStyle('3d')}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewStyle === '3d'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>🏢</span>
              <span>3D Building</span>
            </button>
            <button
              onClick={() => setViewStyle('table')}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewStyle === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>📋</span>
              <span>Room Directory</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>+ Add Room</span>
          </button>
        </div>
      </div>

      {/* Real-time Facility Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Rooms */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Total Suites</span>
            <span>🏢</span>
          </div>
          <div className="mt-2 text-2xl font-black text-zinc-900 dark:text-zinc-50">
            {totalCount}
          </div>
          <p className="mt-0.5 text-[10px] text-zinc-400">3 Floors • Central Pavilion</p>
        </div>

        {/* Available Rooms */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Ready & Available</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {availableCount}
          </div>
          <p className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
            Ready for consultation
          </p>
        </div>

        {/* In Consultation */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">In Consultation</span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            {inConsultationCount}
          </div>
          <p className="mt-0.5 text-[10px] text-blue-500 font-semibold">
            Active patient sessions
          </p>
        </div>

        {/* Maintenance */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Sanitizing / Cleaning</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {maintenanceCount}
          </div>
          <p className="mt-0.5 text-[10px] text-amber-500 font-semibold">
            Sterilization in progress
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search room number, name, or specialty..."
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 text-[11px]">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="All">All Departments</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dental Care">Dental Care</option>
              <option value="Triage & Emergency">Triage & Emergency</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 focus:border-blue-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="All">All Statuses</option>
              <option value="available">🟢 Available</option>
              <option value="consultation">🔵 In Consultation</option>
              <option value="occupied">🔴 Occupied</option>
              <option value="maintenance">🟡 Cleaning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Viewport: 3D Visualizer vs Table */}
      {viewStyle === '3d' ? (
        <Building3DViewer
          rooms={filteredRooms}
          selectedRoom={selectedRoom}
          onSelectRoom={handleSelectRoom}
          filterDepartment={deptFilter}
          filterStatus={statusFilter}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/70 text-zinc-400 uppercase tracking-wider text-[10px] dark:border-zinc-800/80 dark:bg-zinc-950/40">
                  <th className="py-3 px-4 font-bold">Room Code</th>
                  <th className="py-3 px-4 font-bold">Name & Department</th>
                  <th className="py-3 px-4 font-bold">3D Floor Location</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Capacity</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-600 dark:text-zinc-300">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => {
                    const statusColors: Record<string, string> = {
                      available: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
                      consultation: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
                      occupied: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
                      maintenance: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
                    };

                    return (
                      <tr
                        key={room.id}
                        className="group transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                      >
                        <td className="py-3.5 px-4 font-extrabold text-zinc-900 dark:text-zinc-100">
                          {room.room_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span
                              onClick={() => handleSelectRoom(room)}
                              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer block"
                            >
                              {room.name}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {room.department || 'General Care'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {room.floor || '1st Floor'}
                          </span>
                          <span className="text-[10px] text-zinc-400 block">
                            {room.building || 'Central Pavilion'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          {room.room_type}
                        </td>
                        <td className="py-3.5 px-4">
                          👤 {room.capacity}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                              statusColors[room.status] || statusColors.available
                            }`}
                          >
                            ● {room.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSelectRoom(room)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition-colors cursor-pointer"
                              title="Inspect Room"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => handleOpenEdit(room)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-amber-600 dark:hover:bg-zinc-800 dark:hover:text-amber-400 transition-colors cursor-pointer"
                              title="Edit Room"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Room"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400">
                      <div className="text-3xl">🏢</div>
                      <p className="mt-2 text-xs font-semibold">No rooms match your filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Room Drawer */}
      <RoomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        room={selectedRoom}
        onEdit={handleOpenEdit}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteRoom}
      />

      {/* Room Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRoomToEdit(null);
        }}
        roomToEdit={roomToEdit}
        onSave={handleSaveRoom}
      />
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading 3D Clinic Facility...</span>
          </div>
        </div>
      }
    >
      <RoomsManagementContent />
    </Suspense>
  );
}
