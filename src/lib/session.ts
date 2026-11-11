import { User, LoginResponseData } from '@/types/auth.type';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export const DASHBOARD_ALLOWED_ROLES = ['admin', 'doctor', 'nurse', 'cashier', 'super_admin'];

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveAuthSession(data: LoginResponseData): void {
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  setUser(data.user);
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getUserRole(): string | null {
  const user = getUser();
  return user?.role?.name?.toLowerCase() ?? null;
}

/**
 * Access rule:
 * admin, doctor, nurse, cashier -> Can access dashboard & home page
 * patient -> Can ONLY access home page (denied on dashboard)
 */
export function canAccessDashboard(): boolean {
  if (!isAuthenticated()) return false;
  const role = getUserRole();
  if (!role) return false;
  return DASHBOARD_ALLOWED_ROLES.includes(role);
}
