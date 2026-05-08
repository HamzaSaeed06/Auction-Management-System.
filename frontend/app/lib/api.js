import { BACKEND_URL } from './socket';

export async function apiFetch(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Use full URL to avoid rewrite issues
  const url = `${BACKEND_URL}/api${path}`;
  
  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

