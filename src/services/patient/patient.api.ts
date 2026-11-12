import { httpClient } from '@/services/http/client';
import { ApiResponse } from '@/types/api.type';
import {
  PatientCreatePayload,
  PatientProfile,
  PatientUpdatePayload,
} from '@/types/patient.type';

export const patientApi = {
  async getMyProfile(): Promise<PatientProfile | null> {
    try {
      const res = await httpClient.get<ApiResponse<PatientProfile>>('/api/v1/patients/me');
      return res.data || null;
    } catch {
      return null;
    }
  },

  async listPatients(
    page: number = 1,
    pageSize: number = 20,
    search?: string
  ): Promise<{ items: PatientProfile[]; total_records: number; total_pages: number }> {
    try {
      const query = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        ...(search ? { search } : {}),
      });
      const res = await httpClient.get<any>(`/api/v1/patients?${query.toString()}`);
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

  async getPatientById(id: string): Promise<PatientProfile | null> {
    try {
      const res = await httpClient.get<ApiResponse<PatientProfile>>(`/api/v1/patients/${id}`);
      return res.data || null;
    } catch {
      return null;
    }
  },

  async createPatient(payload: PatientCreatePayload): Promise<PatientProfile> {
    const res = await httpClient.post<ApiResponse<PatientProfile>>('/api/v1/patients', payload);
    return res.data;
  },

  async updatePatient(id: string, payload: PatientUpdatePayload): Promise<PatientProfile> {
    const res = await httpClient.put<ApiResponse<PatientProfile>>(`/api/v1/patients/${id}`, payload);
    return res.data;
  },

  async deletePatient(id: string): Promise<boolean> {
    await httpClient.delete<ApiResponse<any>>(`/api/v1/patients/${id}`);
    return true;
  },
};
