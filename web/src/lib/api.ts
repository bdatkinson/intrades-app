export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { name: string; email: string; password: string };
export type ResetRequest = { email: string };
export type ResetConfirmRequest = { token: string; password: string };

export type AuthTokens = { accessToken: string; refreshToken?: string };
export type Profile = { id: string; name: string; email: string; role?: string };

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
    // Option A: Bearer tokens via Authorization header; do not send cookies
    credentials: 'omit',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  login: (body: LoginRequest) =>
    request<AuthTokens>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: RegisterRequest) =>
    request<AuthTokens>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  refresh: (token?: string) =>
    request<AuthTokens>('/api/auth/refresh', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  profile: (token?: string) =>
    request<Profile>('/api/auth/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  resetRequest: (body: ResetRequest) =>
    request<void>('/api/auth/reset/request', { method: 'POST', body: JSON.stringify(body) }),
  resetConfirm: (body: ResetConfirmRequest) =>
    request<void>('/api/auth/reset/confirm', { method: 'POST', body: JSON.stringify(body) }),
};

export const storage = {
  get tokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('auth:tokens');
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  },
  set tokens(v: AuthTokens | null) {
    if (typeof window === 'undefined') return;
    if (!v) localStorage.removeItem('auth:tokens');
    else localStorage.setItem('auth:tokens', JSON.stringify(v));
  },
};