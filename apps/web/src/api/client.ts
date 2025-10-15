const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers || {}) }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers })
  const text = await res.text()
  const data = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || 'Request failed') as any
    if (data?.details) err.details = data.details
    throw err
  }
  return data as T
}

export function setAuthToken(token?: string) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function authHeaders() {
  const t = localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export function getToken() {
  return localStorage.getItem('token')
}
