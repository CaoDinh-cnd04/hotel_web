// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Hotels
  hotels: '/v2/khachsan',
  hotelsLegacy: '/khachsan',
  
  // Rooms
  rooms: '/v2/phong',
  roomsLegacy: '/phong',
  
  // Users
  users: '/v2/nguoidung',
  usersLegacy: '/nguoidung',
  
  // Bookings
  bookings: '/v2/phieudatphong',
  bookingsLegacy: '/phieudatphg',
  bookingsV2: '/bookings',
  
  // Discounts
  discounts: '/v2/magiamgia',
  discountsLegacy: '/magiamgia',
  
  // Reviews
  reviews: '/v2/danhgia',
  reviewsLegacy: '/danhgia',
  
  // Stats
  stats: '/v2/admin/stats'
}


