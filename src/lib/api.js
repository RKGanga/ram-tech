import axios from 'axios'

// Ensure absolute URL for backend base to avoid hitting the Vite dev server by mistake
const BACKEND_BASE = (() => {
  try {
    const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
    const u = new URL(raw)
    return u.origin
  } catch (_) {
    return 'http://localhost:4000'
  }
})()

export const api = axios.create({ baseURL: BACKEND_BASE + '/api' })
export const adminApi = axios.create({ baseURL: BACKEND_BASE + '/api/admin' })

// Temporary debug logs (safe to keep in dev)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[API] BACKEND_BASE =', BACKEND_BASE)
}

export function setAdminKey(key) {
  adminApi.defaults.headers.common['x-admin-key'] = key
}

export function setAdminToken(token) {
  if (!token) {
    delete adminApi.defaults.headers.common['Authorization']
  } else {
    adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
