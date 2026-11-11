export interface Role {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  status: 'active' | 'inactive' | string;
  surface: 'portal' | 'mobile' | string;
  is_verified: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  role?: Role | null;
  role_id?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role_id?: string;
}
