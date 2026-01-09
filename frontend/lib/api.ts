const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { headers, ...rest } = options;
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    // Handle both string and object error details
    const errorMessage = typeof error.detail === 'object' 
      ? JSON.stringify(error.detail)
      : (error.detail || 'An error occurred');
    throw new Error(errorMessage);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => fetchAPI<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: FetchOptions) => fetchAPI<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: FetchOptions) => fetchAPI<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => fetchAPI<T>(endpoint, { ...options, method: 'DELETE' }),
};
