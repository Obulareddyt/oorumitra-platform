import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

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
}

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data, images) => {
    const form = new FormData()
    form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    images?.forEach((img) => form.append('images', img))
    return api.post('/products', form)
  },
  delete: (id) => api.delete(`/products/${id}`),
  getMy: (params) => api.get('/products/my', { params }),
}

export const workersApi = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getMy: (params) => api.get('/workers/my', { params }),
  create: (data) => api.post('/workers', data),
  delete: (id) => api.delete(`/workers/${id}`),
}

export const transportApi = {
  getAll: (params) => api.get('/transport', { params }),
  getById: (id) => api.get(`/transport/${id}`),
  getMy: (params) => api.get('/transport/my', { params }),
  create: (data) => api.post('/transport', data),
  delete: (id) => api.delete(`/transport/${id}`),
}

export const vehicleWorkApi = {
  getAll: (params) => api.get('/vehicle-work', { params }),
  getById: (id) => api.get(`/vehicle-work/${id}`),
  getMy: (params) => api.get('/vehicle-work/my', { params }),
  create: (data) => api.post('/vehicle-work', data),
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

export default api
