import { httpClient } from '@/services/http/client';
import { ApiResponse } from '@/types/api.type';
import { Role, User } from '@/types/auth.type';

export interface UserCreateInput {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role_id?: string;
  status?: string;
  surface?: string;
}

export const userApi = {
  async listUsers(search?: string, roleId?: string): Promise<User[]> {
    try {
      const query = new URLSearchParams({
        page: '1',
        page_size: '50',
        ...(search ? { search } : {}),
        ...(roleId ? { role_id: roleId } : {}),
      });
      const res = await httpClient.get<any>(`/api/v1/users?${query.toString()}`);
      if (res?.data?.lists) {
        return res.data.lists;
      }
      return [];
    } catch {
      return [];
    }
  },

  async createUser(payload: UserCreateInput): Promise<User> {
    const res = await httpClient.post<ApiResponse<User>>('/api/v1/users', payload);
    return res.data;
  },

  async listRoles(): Promise<Role[]> {
    try {
      const res = await httpClient.get<ApiResponse<Role[]>>('/api/v1/roles');
      return res.data || [];
    } catch {
      return [];
    }
  },
};
