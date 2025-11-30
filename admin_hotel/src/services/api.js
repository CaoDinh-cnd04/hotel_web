import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: false
})

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    // Handle different response formats
    if (response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    })

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout - Server không phản hồi'))
    }

    if (error.response) {
      // Server responded with error
      const status = error.response.status
      let message = error.response.data?.message || error.response.data?.error || 'Có lỗi xảy ra'
      
      if (status === 401) {
        message = 'Chưa đăng nhập hoặc token hết hạn'
      } else if (status === 403) {
        message = 'Không có quyền truy cập'
      } else if (status === 404) {
        message = 'Không tìm thấy dữ liệu'
      } else if (status >= 500) {
        message = 'Lỗi server - Vui lòng thử lại sau'
      }
      
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request made but no response - likely CORS or server down
      const isNetworkError = error.message.includes('Network Error') || 
                            error.message.includes('Failed to fetch') ||
                            error.code === 'ERR_NETWORK'
      
      if (isNetworkError) {
        return Promise.reject(new Error('Không thể kết nối đến server. Kiểm tra:\n- Backend có đang chạy tại http://localhost:5000?\n- CORS đã được cấu hình đúng chưa?'))
      }
      
      return Promise.reject(new Error('Không thể kết nối đến server'))
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'Có lỗi xảy ra'))
    }
  }
)

// API functions
export const hotelAPI = {
  getAll: (params = {}) => api.get('/v2/khachsan', { params }),
  getById: (id) => api.get(`/v2/khachsan/${id}`),
  create: (data) => api.post('/v2/khachsan', data),
  update: (id, data) => api.put(`/v2/khachsan/${id}`, data),
  delete: (id) => api.delete(`/v2/khachsan/${id}`)
}

export const roomAPI = {
  getAll: (params = {}) => api.get('/v2/phong', { params }),
  getById: (id) => api.get(`/v2/phong/${id}`),
  create: (data) => api.post('/v2/phong', data),
  update: (id, data) => api.put(`/v2/phong/${id}`, data),
  delete: (id) => api.delete(`/v2/phong/${id}`)
}

export const userAPI = {
  getAll: (params = {}) => api.get('/v2/nguoidung', { params }),
  getById: (id) => api.get(`/v2/nguoidung/${id}`),
  getStats: () => api.get('/v2/nguoidung/stats'),
  update: (id, data) => api.put(`/v2/nguoidung/${id}`, data),
  delete: (id) => api.delete(`/v2/nguoidung/${id}`),
  approve: (id) => api.put(`/v2/nguoidung/${id}/approve`),
  block: (id) => api.put(`/v2/nguoidung/${id}/block`)
}

export const bookingAPI = {
  getAll: (params = {}) => api.get('/v2/phieudatphong', { params }),
  getById: (id) => api.get(`/v2/phieudatphong/${id}`),
  getStats: () => api.get('/v2/phieudatphong/stats'),
  updateStatus: (id, status) => api.put(`/v2/phieudatphong/${id}`, { trang_thai: status }),
  cancel: (id) => api.post(`/v2/phieudatphong/${id}/cancel`)
}

export const discountAPI = {
  getAll: (params = {}) => api.get('/v2/magiamgia', { params }),
  getById: (id) => api.get(`/v2/magiamgia/${id}`),
  create: (data) => api.post('/v2/magiamgia', data),
  update: (id, data) => api.put(`/v2/magiamgia/${id}`, data),
  delete: (id) => api.delete(`/v2/magiamgia/${id}`)
}

export const reviewAPI = {
  getByHotel: (hotelId) => api.get('/v2/danhgia', { params: { ma_khach_san: hotelId } }),
  getAll: (params = {}) => api.get('/v2/danhgia', { params }),
  // Admin endpoints
  getAllAdmin: (params = {}) => api.get('/admin/reviews', { params }),
  getById: (id) => api.get(`/admin/reviews/${id}`),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
  getStats: () => api.get('/admin/reviews/stats'),
  getHotels: () => api.get('/admin/reviews/hotels'),
  updateStatus: (id, status) => api.put(`/admin/reviews/${id}/status`, { status }),
  respond: (id, response) => api.post(`/admin/reviews/${id}/respond`, { response })
}

export const statsAPI = {
  getOverview: () => api.get('/v2/admin/stats').catch(() => {
    // Fallback if admin stats endpoint doesn't exist
    return Promise.resolve({ data: null })
  })
}

export default api

