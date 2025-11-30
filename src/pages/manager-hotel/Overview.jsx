import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Calendar, Bed, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore'

const USE_MOCK_DATA = true

// Mock data for manager's hotel
const mockManagerHotel = {
  ma_khach_san: 1,
  ten_khach_san: 'The Lumière Riverside',
  dia_chi: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  so_sao: 5
}

const mockRooms = [
  { ma_phong: 1, so_phong: '101', ten_phong: 'Phòng Deluxe View Sông', trang_thai: 1, gia_phong: 1500000 },
  { ma_phong: 2, so_phong: '102', ten_phong: 'Phòng Superior', trang_thai: 0, gia_phong: 1200000 },
  { ma_phong: 3, so_phong: '201', ten_phong: 'Phòng Gia Đình', trang_thai: 1, gia_phong: 2500000 },
  { ma_phong: 4, so_phong: '202', ten_phong: 'Phòng Deluxe', trang_thai: 1, gia_phong: 1800000 },
  { ma_phong: 5, so_phong: '301', ten_phong: 'Phòng Suite', trang_thai: 0, gia_phong: 3000000 },
  { ma_phong: 6, so_phong: '302', ten_phong: 'Phòng Premium', trang_thai: 1, gia_phong: 2200000 }
]

const mockBookings = [
  { 
    ma_dat_phong: 1, 
    ten_khach: 'Nguyễn Văn A', 
    so_dien_thoai: '0901234567',
    ngay_nhan: '2025-12-01',
    ngay_tra: '2025-12-03',
    so_phong: '101',
    tong_tien: 3000000,
    trang_thai: 'pending', // pending, approved, rejected, completed
    ngay_dat: '2025-11-25'
  },
  { 
    ma_dat_phong: 2, 
    ten_khach: 'Trần Thị B', 
    so_dien_thoai: '0912345678',
    ngay_nhan: '2025-12-05',
    ngay_tra: '2025-12-07',
    so_phong: '201',
    tong_tien: 5000000,
    trang_thai: 'approved',
    ngay_dat: '2025-11-20'
  },
  { 
    ma_dat_phong: 3, 
    ten_khach: 'Lê Văn C', 
    so_dien_thoai: '0923456789',
    ngay_nhan: '2025-12-10',
    ngay_tra: '2025-12-12',
    so_phong: '301',
    tong_tien: 6000000,
    trang_thai: 'pending',
    ngay_dat: '2025-11-28'
  },
  { 
    ma_dat_phong: 4, 
    ten_khach: 'Phạm Thị D', 
    so_dien_thoai: '0934567890',
    ngay_nhan: '2025-11-28',
    ngay_tra: '2025-11-30',
    so_phong: '102',
    tong_tien: 2400000,
    trang_thai: 'completed',
    ngay_dat: '2025-11-15'
  },
  { 
    ma_dat_phong: 5, 
    ten_khach: 'Hoàng Văn E', 
    so_dien_thoai: '0945678901',
    ngay_nhan: '2025-12-15',
    ngay_tra: '2025-12-17',
    so_phong: '202',
    tong_tien: 3600000,
    trang_thai: 'rejected',
    ngay_dat: '2025-11-22'
  }
]

const mockReviews = [
  { 
    ma_danh_gia: 1, 
    ten_khach: 'Nguyễn Văn A', 
    diem: 5, 
    noi_dung: 'Khách sạn rất đẹp, phục vụ tuyệt vời!',
    ngay_danh_gia: '2025-11-20',
    da_phan_hoi: false
  },
  { 
    ma_danh_gia: 2, 
    ten_khach: 'Trần Thị B', 
    diem: 4, 
    noi_dung: 'Phòng sạch sẽ, view đẹp nhưng wifi hơi chậm',
    ngay_danh_gia: '2025-11-18',
    da_phan_hoi: true
  },
  { 
    ma_danh_gia: 3, 
    ten_khach: 'Lê Văn C', 
    diem: 3, 
    noi_dung: 'Phòng ổn nhưng giá hơi cao',
    ngay_danh_gia: '2025-11-15',
    da_phan_hoi: false
  }
]

const Overview = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    occupancyRate: 0,
    averageRating: 0,
    pendingReviews: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [recentReviews, setRecentReviews] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Calculate stats from mock data
        const totalRooms = mockRooms.length
        const availableRooms = mockRooms.filter(r => r.trang_thai === 0).length
        const bookedRooms = mockRooms.filter(r => r.trang_thai === 1).length
        
        const pendingBookings = mockBookings.filter(b => b.trang_thai === 'pending').length
        const approvedBookings = mockBookings.filter(b => b.trang_thai === 'approved').length
        
        // Calculate revenue
        const today = new Date().toISOString().split('T')[0]
        const todayRevenue = mockBookings
          .filter(b => b.ngay_nhan === today && b.trang_thai === 'approved')
          .reduce((sum, b) => sum + b.tong_tien, 0)
        
        const currentMonth = new Date().getMonth() + 1
        const monthRevenue = mockBookings
          .filter(b => {
            const bookingMonth = new Date(b.ngay_nhan).getMonth() + 1
            return bookingMonth === currentMonth && b.trang_thai === 'approved'
          })
          .reduce((sum, b) => sum + b.tong_tien, 0)
        
        // Occupancy rate
        const occupancyRate = totalRooms > 0 ? ((bookedRooms / totalRooms) * 100).toFixed(1) : 0
        
        // Average rating
        const averageRating = mockReviews.length > 0
          ? (mockReviews.reduce((sum, r) => sum + r.diem, 0) / mockReviews.length).toFixed(1)
          : 0
        
        // Pending reviews (chưa phản hồi)
        const pendingReviews = mockReviews.filter(r => !r.da_phan_hoi).length
        
        setStats({
          totalRooms,
          availableRooms,
          bookedRooms,
          pendingBookings,
          approvedBookings,
          todayRevenue,
          monthRevenue,
          occupancyRate,
          averageRating,
          pendingReviews
        })
        
        // Recent bookings (pending và approved)
        setRecentBookings(mockBookings.filter(b => 
          b.trang_thai === 'pending' || b.trang_thai === 'approved'
        ).slice(0, 5))
        
        // Recent reviews (chưa phản hồi)
        setRecentReviews(mockReviews.filter(r => !r.da_phan_hoi).slice(0, 3))
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' }
    }
    const badge = badges[status] || badges.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bảng điều khiển</h1>
        <p className="text-slate-600">
          Khách sạn: <span className="font-semibold text-emerald-600">{mockManagerHotel.ten_khach_san}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Tổng số phòng</p>
            <Bed className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalRooms}</p>
          <p className="text-xs text-slate-400">
            {stats.availableRooms} trống • {stats.bookedRooms} đã đặt
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Đặt phòng chờ duyệt</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.pendingBookings}</p>
          <p className="text-xs text-slate-400">Cần xử lý ngay</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Doanh thu tháng</p>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-1">
            {(stats.monthRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-slate-400">VND</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Tỷ lệ lấp đầy</p>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-1">{stats.occupancyRate}%</p>
          <p className="text-xs text-slate-400">Tỷ lệ phòng đã đặt</p>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-5 md:grid-cols-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Đánh giá trung bình</p>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.averageRating}</p>
          <p className="text-xs text-slate-400">Từ {mockReviews.length} đánh giá</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Đánh giá chờ phản hồi</p>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-1">{stats.pendingReviews}</p>
          <p className="text-xs text-slate-400">Cần phản hồi</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">Đặt phòng đã duyệt</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 mb-1">{stats.approvedBookings}</p>
          <p className="text-xs text-slate-400">Trong tháng này</p>
        </motion.div>
      </div>

      {/* Recent Bookings and Reviews */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Đặt phòng gần đây
            </h2>
            <button
              onClick={() => navigate('/manager-hotel/bookings')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-center text-slate-400 py-8">Không có đặt phòng nào</p>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.ma_dat_phong}
                  className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">{booking.ten_khach}</p>
                        {getStatusBadge(booking.trang_thai)}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        Phòng {booking.so_phong} • {booking.ngay_nhan} → {booking.ngay_tra}
                      </p>
                      <p className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(booking.tong_tien)}
                      </p>
                    </div>
                    {booking.trang_thai === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                          Duyệt
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Đánh giá chờ phản hồi
            </h2>
            <button
              onClick={() => navigate('/manager-hotel/reviews')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-3">
            {recentReviews.length === 0 ? (
              <p className="text-center text-slate-400 py-8">Không có đánh giá nào cần phản hồi</p>
            ) : (
              recentReviews.map((review) => (
                <div
                  key={review.ma_danh_gia}
                  className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 mb-1">{review.ten_khach}</p>
                      {renderStars(review.diem)}
                    </div>
                    <span className="text-xs text-slate-400">{review.ngay_danh_gia}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{review.noi_dung}</p>
                  <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                    Phản hồi
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Overview

