import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { name: string; email: string; phone: string; password: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data: { name: string; phone: string }) => api.put('/auth/profile', data),
  changePassword: (data: { old_password: string; new_password: string }) => api.put('/auth/password', data),
}

// Menu
export const menuApi = {
  getAll: (params?: object) => api.get('/menu', { params }),
  getOne: (id: number) => api.get(`/menu/${id}`),
  create: (data: object) => api.post('/admin/menu', data),
  update: (id: number, data: object) => api.put(`/admin/menu/${id}`, data),
  delete: (id: number) => api.delete(`/admin/menu/${id}`),
}

// Reservations
export const reservationApi = {
  create: (data: object) => api.post('/reservations', data),
  getMy: () => api.get('/reservations/my'),
  getAll: (params?: object) => api.get('/reservations', { params }),
  updateStatus: (id: number, data: object) => api.put(`/reservations/${id}/status`, data),
  cancel: (id: number) => api.delete(`/reservations/${id}`),
}

// Orders
export const orderApi = {
  create: (data: object) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getAll: (params?: object) => api.get('/orders', { params }),
  updateStatus: (id: number, data: object) => api.put(`/orders/${id}/status`, data),
}

// Gallery
export const galleryApi = {
  getAll: (params?: object) => api.get('/gallery', { params }),
  create: (data: object) => api.post('/admin/gallery', data),
  update: (id: number, data: object) => api.put(`/admin/gallery/${id}`, data),
  delete: (id: number) => api.delete(`/admin/gallery/${id}`),
}

// Reviews
export const reviewApi = {
  getAll: () => api.get('/reviews'),
  create: (data: object) => api.post('/reviews', data),
  getAllAdmin: () => api.get('/admin/reviews'),
  approve: (id: number) => api.put(`/admin/reviews/${id}/approve`),
}

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: object) => api.get('/admin/users', { params }),
  updateUserRole: (id: number, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUser: (id: number) => api.put(`/admin/users/${id}/toggle`),
  getSettings: () => api.get('/settings'),
  updateSetting: (key: string, value: string) => api.put(`/admin/settings/${key}`, { value }),
}
