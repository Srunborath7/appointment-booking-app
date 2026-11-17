'use client';

import React, { useState } from 'react';
import { Room } from '@/types/room.type';

interface Building3DViewerProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  filterDepartment?: string;
  filterStatus?: string;
}

type CameraPreset = 'iso_left' | 'iso_right' | 'front' | 'top_down';
type ViewMode = 'exploded' | 'stacked' | 'floor_1' | 'floor_2' | 'floor_3';

export function Building3DViewer({
  rooms,
  selectedRoom,
  onSelectRoom,
  filterDepartment = 'All',
  filterStatus = 'All',
}: Building3DViewerProps) {
  const [camera, setCamera] = useState<CameraPreset>('iso_left');
  const [viewMode, setViewMode] = useState<ViewMode>('exploded');
  const [rotationZ, setRotationZ] = useState<number>(-35);
  const [rotationX, setRotationX] = useState<number>(55);
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  // Robust floor matcher for any format: "1st Floor", "1", "F1", "1F", "Floor 1", etc.
  const isFloor = (r: Room, floorNum: number) => {
    const f = (r.floor || '').toLowerCase().trim();
    const num = (r.room_number || '').toLowerCase().trim();
    const target = String(floorNum);

    if (
      f === target ||
      f === `f${target}` ||
      f === `${target}f` ||
      f.includes(`${target}st`) ||
      f.includes(`${target}nd`) ||
      f.includes(`${target}rd`) ||
      f.includes(`${target}th`) ||
      f.includes(`floor ${target}`) ||
      f.includes(`floor-${target}`) ||
      f.includes(`level ${target}`)
    ) {
      return true;
    }

    // Heuristics based on room number like R-101, R101, 101, A01, etc.
    if (num.startsWith(`r-${target}`) || num.startsWith(`r${target}`)) {
      return true;
    }
    const match = num.match(/\d+/);
    if (match) {
      const val = parseInt(match[0], 10);
      if (val >= floorNum * 100 && val < (floorNum + 1) * 100) return true;
      if (floorNum === 1 && val < 100) return true;
    }

    return false;
  };

  // Group rooms by floor
  const floor3Rooms = rooms.filter((r) => isFloor(r, 3));
  const floor2Rooms = rooms.filter((r) => isFloor(r, 2));
  const floor1Rooms = rooms.filter(
    (r) => isFloor(r, 1) || (!isFloor(r, 2) && !isFloor(r, 3))
  );

  // Camera angles
  const applyPreset = (preset: CameraPreset) => {
    setCamera(preset);
    if (preset === 'iso_left') {
      setRotationX(55);
      setRotationZ(-35);
    } else if (preset === 'iso_right') {
      setRotationX(55);
      setRotationZ(35);
    } else if (preset === 'front') {
      setRotationX(20);
      setRotationZ(0);
    } else if (preset === 'top_down') {
      setRotationX(0);
      setRotationZ(0);
    }
  };

  // Status colors & styles
  const getRoomStyle = (room: Room) => {
    const isSelected = selectedRoom?.id === room.id;
    const isHovered = hoveredRoom?.id === room.id;

    let baseBg = 'bg-white/95 dark:bg-zinc-900/95';
    let borderColor = 'border-zinc-300 dark:border-zinc-700';
    let glowColor = '';
    let textColor = 'text-zinc-800 dark:text-zinc-200';

    switch (room.status) {
      case 'available':
        borderColor = 'border-emerald-500/60 dark:border-emerald-500/70';
        glowColor = 'shadow-emerald-500/30';
        textColor = 'text-emerald-700 dark:text-emerald-400';
        baseBg = 'bg-emerald-50/90 dark:bg-emerald-950/40';
        break;
      case 'occupied':
        borderColor = 'border-rose-500/60 dark:border-rose-500/70';
        glowColor = 'shadow-rose-500/30';
        textColor = 'text-rose-700 dark:text-rose-400';
        baseBg = 'bg-rose-50/90 dark:bg-rose-950/40';
        break;
      case 'in_consultation':
      case 'consultation':
        borderColor = 'border-blue-500/60 dark:border-blue-500/70';
        glowColor = 'shadow-blue-500/30';
        textColor = 'text-blue-700 dark:text-blue-400';
        baseBg = 'bg-blue-50/90 dark:bg-blue-950/40';
        break;
      case 'maintenance':
        borderColor = 'border-amber-500/60 dark:border-amber-500/70';
        glowColor = 'shadow-amber-500/30';
        textColor = 'text-amber-700 dark:text-amber-400';
        baseBg = 'bg-amber-50/90 dark:bg-amber-950/40';
        break;
    }

    if (isSelected) {
      borderColor = 'border-blue-600 ring-3 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900';
      glowColor = 'shadow-xl shadow-blue-500/50';
    }

    return { baseBg, borderColor, glowColor, textColor, isSelected, isHovered };
  };

  const isRoomVisible = (room: Room) => {
    if (filterDepartment !== 'All' && room.department !== filterDepartment) return false;
    if (filterStatus !== 'All' && room.status !== filterStatus) return false;
    return true;
  };

  // Calculate vertical separation offsets based on viewMode
  const getFloorTransform = (floorNum: number) => {
    if (viewMode === 'stacked') {
      return `translateZ(${(floorNum - 1) * 70}px)`;
    }
    if (viewMode === 'exploded') {
      return `translateZ(${(floorNum - 1) * 180}px)`;
    }
    // Single floor focus
    if (viewMode === 'floor_1') {
      return floorNum === 1 ? 'translateZ(60px)' : 'translateZ(0px) scale(0.7) opacity-0';
    }
    if (viewMode === 'floor_2') {
      return floorNum === 2 ? 'translateZ(60px)' : 'translateZ(0px) scale(0.7) opacity-0';
    }
    if (viewMode === 'floor_3') {
      return floorNum === 3 ? 'translateZ(60px)' : 'translateZ(0px) scale(0.7) opacity-0';
    }
    return '';
  };

  const renderFloorRooms = (floorRooms: Room[], floorLabel: string, floorLevel: number) => {
    return (
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          transform: getFloorTransform(floorLevel),
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floor Slab / Architectural Plate */}
        <div className="relative h-full w-full rounded-3xl border-2 border-zinc-300/80 bg-gradient-to-br from-slate-100/90 to-slate-200/80 p-5 shadow-2xl backdrop-blur-md dark:border-zinc-700/80 dark:from-zinc-900/90 dark:to-zinc-950/80 transition-colors">
          {/* Floor Tag & Neon Accent */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-black text-white shadow-xs">
                {floorLevel}F
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {floorLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-semibold">
              <span>{floorRooms.length} Clinical Suites</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Rooms Grid inside this Floor */}
          {floorRooms.length === 0 ? (
            <div className="mt-4 flex h-24 items-center justify-center rounded-2xl border border-dashed border-zinc-300/80 bg-white/40 text-center dark:border-zinc-700/80 dark:bg-zinc-900/40">
              <p className="text-xs font-medium text-zinc-400">
                No rooms assigned to {floorLabel}
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-3.5">
              {floorRooms.map((room) => {
                const visible = isRoomVisible(room);
                const { baseBg, borderColor, glowColor, textColor, isSelected } =
                  getRoomStyle(room);

                return (
                  <div
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${baseBg} ${borderColor} ${glowColor} ${
                      !visible ? 'opacity-30 grayscale' : 'hover:-translate-y-1.5 hover:shadow-lg'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Top Bar: Room Number & Status Dot */}
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs tracking-tight text-zinc-900 dark:text-zinc-100">
                        {room.room_number}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          room.status === 'available'
                            ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                            : room.status === 'occupied'
                            ? 'bg-rose-500 ring-2 ring-rose-500/20'
                            : room.status === 'maintenance'
                            ? 'bg-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-blue-500 ring-2 ring-blue-500/20'
                        }`}
                      />
                    </div>

                    {/* Room Name & Specialty */}
                    <div className="my-2 min-h-[38px]">
                      <p className="text-xs font-semibold leading-tight text-zinc-800 dark:text-zinc-200 line-clamp-1">
                        {room.name}
                      </p>
                      <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {room.department || 'General Care'}
                      </p>
                    </div>

                    {/* Bottom Footer: Doctor / Capacity */}
                    <div className="flex items-center justify-between border-t border-zinc-200/60 pt-2 text-[10px] dark:border-zinc-800/80">
                      <span className={`font-semibold capitalize ${textColor}`}>
                        {room.status.replace('_', ' ')}
                      </span>
                      <span className="text-zinc-400">
                        👤 {room.capacity}
                      </span>
                    </div>

                    {/* 3D Depth Floor Plate */}
                    <div
                      className="absolute inset-x-0 -bottom-1.5 h-1.5 rounded-b-2xl bg-zinc-300 dark:bg-zinc-800 pointer-events-none transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Central Corridor & Elevator Shaft Accent */}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-200/60 px-3 py-1.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
            <span>🚪 Elevator & Central Hallway</span>
            <span>Emergency Exit &rarr;</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-slate-50 to-slate-100/80 shadow-md dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900/90">
      {/* 3D Viewer Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
          <button
            onClick={() => setViewMode('exploded')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'exploded'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            💥 Exploded 3D
          </button>
          <button
            onClick={() => setViewMode('stacked')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'stacked'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            🏢 Stacked Building
          </button>
          <button
            onClick={() => setViewMode('floor_3')}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'floor_3'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            3F
          </button>
          <button
            onClick={() => setViewMode('floor_2')}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'floor_2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            2F
          </button>
          <button
            onClick={() => setViewMode('floor_1')}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'floor_1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            1F
          </button>
        </div>

        {/* Right: Camera Angle Presets & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => applyPreset('iso_left')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                camera === 'iso_left'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              Iso Left
            </button>
            <button
              onClick={() => applyPreset('iso_right')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                camera === 'iso_right'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              Iso Right
            </button>
            <button
              onClick={() => applyPreset('top_down')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                camera === 'top_down'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              Top-Down
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="px-2 py-0.5 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
              title="Zoom Out"
            >
              −
            </button>
            <span className="text-[11px] font-semibold text-zinc-500 w-9 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="px-2 py-0.5 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 3D Stage / Isometric Viewport */}
      <div
        className="relative flex h-[580px] w-full items-center justify-center overflow-hidden"
        style={{
          perspective: '1400px',
        }}
      >
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f01a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f01a_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#27272a26_1px,transparent_1px),linear-gradient(to_bottom,#27272a26_1px,transparent_1px)] pointer-events-none" />

        {/* 3D Rotating Container */}
        <div
          className="relative h-[340px] w-[520px] transition-transform duration-500 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${zoom}) rotateX(${rotationX}deg) rotateZ(${rotationZ}deg)`,
          }}
        >
          {/* Foundation Slab / Ground Plate */}
          <div
            className="absolute -inset-10 rounded-[40px] border-2 border-dashed border-zinc-300 bg-zinc-200/50 shadow-2xl dark:border-zinc-700/60 dark:bg-zinc-950/40"
            style={{
              transform: 'translateZ(-40px)',
            }}
          >
            <div className="p-3 text-[10px] font-bold text-zinc-400">
              MAIN CLINIC CAMPUS • CENTRAL MEDICAL PAVILION
            </div>
          </div>

          {/* 1st Floor (Lobby, Triage & Emergency) */}
          {renderFloorRooms(floor1Rooms, '1F: Triage, Urgent Care & Reception', 1)}

          {/* 2nd Floor (Consultation Suites & Diagnostics) */}
          {renderFloorRooms(floor2Rooms, '2F: Outpatient Consultation Suites', 2)}

          {/* 3rd Floor (Specialist & Surgical Wings) */}
          {renderFloorRooms(floor3Rooms, '3F: Cardiology, Surgery & Specialized Suites', 3)}
        </div>

        {/* Floating Holographic Hover Tooltip */}
        {hoveredRoom && (
          <div className="absolute bottom-6 left-6 z-30 rounded-2xl border border-zinc-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                {hoveredRoom.room_number}: {hoveredRoom.name}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${
                  hoveredRoom.status === 'available'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {hoveredRoom.status.replace('_', ' ')}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {hoveredRoom.department} • Floor: {hoveredRoom.floor || '1st Floor'} • Capacity: {hoveredRoom.capacity} Patients
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 px-3.5 py-2 text-xs shadow-md backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Consultation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Cleaning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
