import { httpClient } from '@/services/http/client';
import { ApiResponse } from '@/types/api.type';
import {
  LoginPayload,
  LoginResponseData,
  RegisterPayload,
  User,
} from '@/types/auth.type';
import {
  clearAuthSession,
  getRefreshToken,
  saveAuthSession,
  setUser,
} from '@/lib/session';

export const authApi = {
  /**
   * Authenticate user with email and password
   */
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
    const response = await httpClient.post<ApiResponse<LoginResponseData>>(
      '/api/v1/auth/login',
      payload
    );

    if (response?.data) {
      saveAuthSession(response.data);
    }

    return response;
  },

  /**
   * Register a new user account
   */
  async register(
    payload: RegisterPayload
  ): Promise<ApiResponse<LoginResponseData>> {
    const response = await httpClient.post<ApiResponse<LoginResponseData>>(
      '/api/v1/auth/register',
      payload
    );

    if (response?.data) {
      saveAuthSession(response.data);
    }

    return response;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<ApiResponse<User>> {
    const response = await httpClient.get<ApiResponse<User>>('/api/v1/auth/me');

    if (response?.data) {
      setUser(response.data);
    }

    return response;
  },

  /**
   * Refresh JWT access token
   */
  async refreshToken(
    token?: string
  ): Promise<ApiResponse<{ access_token: string; token_type: string }>> {
    const tokenToUse = token || getRefreshToken();
    if (!tokenToUse) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post<
      ApiResponse<{ access_token: string; token_type: string }>
    >(`/api/v1/auth/refresh?refresh_token=${encodeURIComponent(tokenToUse)}`);

    return response;
  },

  /**
   * End current session and clear stored tokens
   */
  logout(): void {
    clearAuthSession();
  },
};
