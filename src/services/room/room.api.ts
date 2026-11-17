import { httpClient } from '@/services/http/client';
import { ApiResponse } from '@/types/api.type';
import { Room, RoomCreatePayload, RoomUpdatePayload } from '@/types/room.type';

export const roomApi = {
  async listRooms(
    page: number = 1,
    pageSize: number = 50,
    department?: string,
    roomType?: string,
    status?: string,
    search?: string
  ): Promise<{ items: Room[]; total_records: number; total_pages: number }> {
    try {
      const query = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        ...(department && department !== 'All' ? { department } : {}),
        ...(roomType && roomType !== 'All' ? { room_type: roomType } : {}),
        ...(status && status !== 'All' ? { status } : {}),
        ...(search ? { search } : {}),
      });
      const res = await httpClient.get<any>(`/api/v1/rooms?${query.toString()}`);
      if (res?.data?.lists) {
        return {
          items: res.data.lists,
          total_records: res.data.total_records || res.data.lists.length,
          total_pages: res.data.total_pages || 1,
        };
      }
      return { items: [], total_records: 0, total_pages: 1 };
    } catch {
      return { items: [], total_records: 0, total_pages: 1 };
    }
  },

  async getRoomById(id: string): Promise<Room | null> {
    try {
      const res = await httpClient.get<ApiResponse<Room>>(`/api/v1/rooms/${id}`);
      return res.data || null;
    } catch {
      return null;
    }
  },

  async createRoom(payload: RoomCreatePayload): Promise<Room> {
    const res = await httpClient.post<ApiResponse<Room>>('/api/v1/rooms', payload);
    return res.data;
  },

  async updateRoom(id: string, payload: RoomUpdatePayload): Promise<Room> {
    const res = await httpClient.put<ApiResponse<Room>>(`/api/v1/rooms/${id}`, payload);
    return res.data;
  },

  async deleteRoom(id: string): Promise<boolean> {
    await httpClient.delete<ApiResponse<any>>(`/api/v1/rooms/${id}`);
    return true;
  },
};
