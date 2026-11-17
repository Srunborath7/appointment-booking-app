export interface Room {
  id: string;
  room_number: string;
  name: string;
  room_type: string;
  department?: string | null;
  floor?: string | null;
  building?: string | null;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | string;
  description?: string | null;
  is_active: boolean;
  assigned_doctor?: string | null;
  current_patient?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RoomCreatePayload {
  room_number: string;
  name: string;
  room_type: string;
  department?: string;
  floor?: string;
  building?: string;
  capacity?: number;
  status?: string;
  description?: string;
  is_active?: boolean;
}

export interface RoomUpdatePayload {
  room_number?: string;
  name?: string;
  room_type?: string;
  department?: string;
  floor?: string;
  building?: string;
  capacity?: number;
  status?: string;
  description?: string;
  is_active?: boolean;
}
