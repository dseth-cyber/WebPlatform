import { ApiResponse } from '../types/domain';

const API_BASE = '/api/v1';

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: Record<string, any>;

  constructor(message: string, code = 'INTERNAL_ERROR', status = 500, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const csrfToken = localStorage.getItem('csrf_token');
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, config);

    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      // Session expired or unauthorized
      localStorage.removeItem('lohakit_admin_user');
    }

    const data: ApiResponse<T> = await res.json().catch(() => ({
      data: null as any,
      error: { code: 'INVALID_JSON', message: 'Invalid response from server' },
    }));

    if (!res.ok || data.error) {
      throw new ApiError(
        data.error?.message || `Request failed with status ${res.status}`,
        data.error?.code || 'HTTP_ERROR',
        res.status,
        data.error?.details
      );
    }

    return data;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connection failed', 'NETWORK_ERROR', 0);
  }
}
