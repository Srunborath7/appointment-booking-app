import { ApiError } from '@/types/api.type';
import { getAccessToken, clearAuthSession } from '@/lib/session';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  baseUrl?: string;
  skipAuth?: boolean;
}

async function request<T>(
  method: string,
  path: string,
  options?: RequestOptions
): Promise<T> {
  const baseUrl = options?.baseUrl ?? API_BASE_URL;
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${cleanPath}`;

  const token = !options?.skipAuth ? getAccessToken() : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      method,
      headers,
    });
  } catch (error) {
    console.error(`Network error on ${method} ${url}:`, error);
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Unable to connect to the server. Please check your network connection.'
    );
  }

  // Parse response body
  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMsg =
      data?.msg ||
      data?.message ||
      (typeof data?.detail === 'string' ? data.detail : null) ||
      (Array.isArray(data?.detail)
        ? data.detail.map((d: any) => d.msg).join('; ')
        : null) ||
      `HTTP Error ${response.status}: ${response.statusText}`;

    const errorCode = data?.code || response.status;

    // Handle token expiration
    if (response.status === 401 && !path.includes('/auth/login')) {
      clearAuthSession();
    }

    throw new ApiError(response.status, errorCode, errorMsg, data);
  }

  return data as T;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, {
      ...options,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, {
      ...options,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, {
      ...options,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, options),
};
