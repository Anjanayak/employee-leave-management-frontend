import api from './api'

export async function login(username, password) {
  const response = await api.post('/api/auth/login', { username, password })
  const data = response.data || {}
  const token = data.token || data.accessToken || data.jwt
  if (!token) {
    throw new Error('Login response did not contain token, accessToken, or jwt. Check your backend LoginResponse field.')
  }
  localStorage.setItem('adminToken', token)
  localStorage.setItem('adminUsername', username)
  return data
}

export function logout() {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUsername')
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('adminToken'))
}