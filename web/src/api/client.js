import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data.data ?? res.data,
  (err) => {
    const msg = err.response?.data?.message ?? err.message
    return Promise.reject(new Error(msg))
  },
)

export const authApi = {
  sendOtp: (mobileNumber) => api.post('/auth/send-otp', { mobileNumber }),
  login: (mobileNumber, otp) => api.post('/auth/login', { mobileNumber, otp }),
  loginWithCredentials: (username, password) => api.post('/auth/login-credentials', { username, password }),
  register: (data) => api.post('/auth/register', data),
}

function multipartCreate(url, data, images, voiceBlob) {
  const form = new FormData()
  form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  images?.forEach((img) => form.append('images', img))
  if (voiceBlob) form.append('voiceNote', voiceBlob, 'voice-note.webm')
  return api.post(url, form)
}

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data, images, voiceBlob) => multipartCreate('/products', data, images, voiceBlob),
  delete: (id) => api.delete(`/products/${id}`),
  getMy: (params) => api.get('/products/my', { params }),
}

export const workersApi = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getMy: (params) => api.get('/workers/my', { params }),
  create: (data, images, voiceBlob) => multipartCreate('/workers', data, images, voiceBlob),
  delete: (id) => api.delete(`/workers/${id}`),
}

export const transportApi = {
  getAll: (params) => api.get('/transport', { params }),
  getById: (id) => api.get(`/transport/${id}`),
  getMy: (params) => api.get('/transport/my', { params }),
  create: (data, images, voiceBlob) => multipartCreate('/transport', data, images, voiceBlob),
  delete: (id) => api.delete(`/transport/${id}`),
}

export const vehicleWorkApi = {
  getAll: (params) => api.get('/vehicle-work', { params }),
  getById: (id) => api.get(`/vehicle-work/${id}`),
  getMy: (params) => api.get('/vehicle-work/my', { params }),
  create: (data, images, voiceBlob) => multipartCreate('/vehicle-work', data, images, voiceBlob),
  delete: (id) => api.delete(`/vehicle-work/${id}`),
}

export const bookingsApi = {
  getMy: (params) => api.get('/bookings/my', { params }),
  create: (params) => api.post('/bookings', null, { params }),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, null, { params: { status } }),
}

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

export const emergencyApi = {
  getServices: () => api.get('/emergency/services'),
}

export const villageApi = {
  getAll: () => api.get('/villages/all'),
  list: (params) => api.get('/villages', { params }),
  get: (id) => api.get(`/villages/${id}`),
  create: (data) => api.post('/villages', data),
  update: (id, data) => api.put(`/villages/${id}`, data),
  toggleStatus: (id) => api.patch(`/villages/${id}/status`),
  assignAdmin: (villageId, userId) => api.post(`/villages/${villageId}/admins/${userId}`),
  removeAdmin: (villageId, userId) => api.delete(`/villages/${villageId}/admins/${userId}`),
  summaryReport: () => api.get('/villages/reports/summary'),
}

export const userMgmtApi = {
  list: (params) => api.get('/management/users', { params }),
  get: (id) => api.get(`/management/users/${id}`),
  assignRole: (id, data) => api.put(`/management/users/${id}/assign-role`, data),
  toggleActive: (id) => api.patch(`/management/users/${id}/toggle-active`),
}

export const rolesApi = {
  list: (params) => api.get('/roles', { params }),
  get: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
  updatePermissions: (id, permissionIds) => api.put(`/roles/${id}/permissions`, permissionIds),
  getAllPermissions: () => api.get('/roles/permissions/all'),
  getAuditLog: (params) => api.get('/roles/audit-log', { params }),
}

export const adminApi = {
  getPending: () => api.get('/admin/pending'),
  getStats: () => api.get('/admin/stats'),
  getProducts: (params) => api.get('/admin/products', { params }),
  getWorkers: (params) => api.get('/admin/workers', { params }),
  getTransport: (params) => api.get('/admin/transport', { params }),
  getVehicleWork: (params) => api.get('/admin/vehicle-work', { params }),
  approveProduct: (id, data) => api.post(`/admin/products/${id}/approve`, data),
  rejectProduct: (id, data) => api.post(`/admin/products/${id}/reject`, data),
  approveWorker: (id, data) => api.post(`/admin/workers/${id}/approve`, data),
  rejectWorker: (id, data) => api.post(`/admin/workers/${id}/reject`, data),
  approveTransport: (id, data) => api.post(`/admin/transport/${id}/approve`, data),
  rejectTransport: (id, data) => api.post(`/admin/transport/${id}/reject`, data),
  approveVehicleWork: (id, data) => api.post(`/admin/vehicle-work/${id}/approve`, data),
  rejectVehicleWork: (id, data) => api.post(`/admin/vehicle-work/${id}/reject`, data),
}

export default api
