const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
  return res.json() as Promise<T>
}

export function setAuthToken(token?: string) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function authHeaders() {
  const t = localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}
