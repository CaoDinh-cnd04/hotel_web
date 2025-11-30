import React, { useState, useEffect } from 'react'
import { Loader2, Search, CheckCircle, XCircle, Eye, Calendar, User, Phone, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const USE_MOCK_DATA = true

// Mock bookings data
const mockBookings = [
  { 
    ma_dat_phong: 1, 
    ten_khach: 'Nguyễn Văn A', 
    email: 'nguyenvana@email.com',
    so_dien_thoai: '0901234567',
    ngay_nhan: '2025-12-01',
    ngay_tra: '2025-12-03',
    so_phong: '101',
    ten_phong: 'Phòng Deluxe View Sông',
    tong_tien: 3000000,
    trang_thai: 'pending',
    ngay_dat: '2025-11-25',
    ghi_chu: 'Yêu cầu phòng view đẹp'
  },
  { 
    ma_dat_phong: 2, 
    ten_khach: 'Trần Thị B', 
    email: 'tranthib@email.com',
    so_dien_thoai: '0912345678',
    ngay_nhan: '2025-12-05',
    ngay_tra: '2025-12-07',
    so_phong: '201',
    ten_phong: 'Phòng Gia Đình',
    tong_tien: 5000000,
    trang_thai: 'approved',
    ngay_dat: '2025-11-20',
    ghi_chu: ''
  },
  { 
    ma_dat_phong: 3, 
    ten_khach: 'Lê Văn C', 
    email: 'levanc@email.com',
    so_dien_thoai: '0923456789',
    ngay_nhan: '2025-12-10',
    ngay_tra: '2025-12-12',
    so_phong: '301',
    ten_phong: 'Phòng Suite',
    tong_tien: 6000000,
    trang_thai: 'pending',
    ngay_dat: '2025-11-28',
    ghi_chu: 'Có trẻ em đi cùng'
  },
  { 
    ma_dat_phong: 4, 
    ten_khach: 'Phạm Thị D', 
    email: 'phamthid@email.com',
    so_dien_thoai: '0934567890',
    ngay_nhan: '2025-11-28',
    ngay_tra: '2025-11-30',
    so_phong: '102',
    ten_phong: 'Phòng Superior',
    tong_tien: 2400000,
    trang_thai: 'completed',
    ngay_dat: '2025-11-15',
    ghi_chu: ''
  },
  { 
    ma_dat_phong: 5, 
    ten_khach: 'Hoàng Văn E', 
    email: 'hoangvane@email.com',
    so_dien_thoai: '0945678901',
    ngay_nhan: '2025-12-15',
    ngay_tra: '2025-12-17',
    so_phong: '202',
    ten_phong: 'Phòng Deluxe',
    tong_tien: 3600000,
    trang_thai: 'rejected',
    ngay_dat: '2025-11-22',
    ghi_chu: 'Đã từ chối do không đủ phòng'
  },
  { 
    ma_dat_phong: 6, 
    ten_khach: 'Võ Thị F', 
    email: 'vothif@email.com',
    so_dien_thoai: '0956789012',
    ngay_nhan: '2025-12-20',
    ngay_tra: '2025-12-22',
    so_phong: '302',
    ten_phong: 'Phòng Premium',
    tong_tien: 4400000,
    trang_thai: 'pending',
    ngay_dat: '2025-11-30',
    ghi_chu: 'Yêu cầu giường lớn'
  }
]

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setBookings(mockBookings)
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      toast.error('Không thể tải danh sách đặt phòng')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        setBookings(bookings.map(b => 
          b.ma_dat_phong === id 
            ? { ...b, trang_thai: 'approved' }
            : b
        ))
        toast.success('Đã duyệt đặt phòng thành công!')
      }
    } catch (err) {
      toast.error('Lỗi khi duyệt đặt phòng')
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc muốn từ chối đặt phòng này?')) {
      return
    }
    
    try {
      if (USE_MOCK_DATA) {
        setBookings(bookings.map(b => 
          b.ma_dat_phong === id 
            ? { ...b, trang_thai: 'rejected' }
            : b
        ))
        toast.success('Đã từ chối đặt phòng')
      }
    } catch (err) {
      toast.error('Lỗi khi từ chối đặt phòng')
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
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Calendar },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
    }
    const badge = badges[status] || badges.pending
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    )
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.ten_khach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.so_dien_thoai?.includes(searchTerm) ||
      booking.so_phong?.includes(searchTerm) ||
      booking.ma_dat_phong?.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || booking.trang_thai === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý đặt phòng</h1>
          <p className="text-slate-500 mt-1">Duyệt và quản lý đặt phòng của khách sạn</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại, số phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Mã đặt phòng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Khách hàng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Phòng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Ngày nhận/trả</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Tổng tiền</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Trạng thái</th>
                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Không tìm thấy đặt phòng nào' 
                      : 'Chưa có đặt phòng nào'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <motion.tr
                    key={booking.ma_dat_phong}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-700">#{booking.ma_dat_phong}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-800">{booking.ten_khach}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <Phone size={14} />
                          {booking.so_dien_thoai}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{booking.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-800">Phòng {booking.so_phong}</p>
                        <p className="text-sm text-slate-500">{booking.ten_phong}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-emerald-500" />
                        <div>
                          <p className="text-slate-800">{booking.ngay_nhan}</p>
                          <p className="text-slate-500">→ {booking.ngay_tra}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-emerald-600">{formatCurrency(booking.tong_tien)}</p>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(booking.trang_thai)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {booking.trang_thai === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(booking.ma_dat_phong)}
                              className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Duyệt
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(booking.ma_dat_phong)}
                              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                              <XCircle size={16} />
                              Từ chối
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-5 md:grid-cols-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Tổng đặt phòng</p>
          <p className="text-2xl font-bold text-slate-800">{bookings.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Chờ duyệt</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.trang_thai === 'pending').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Đã duyệt</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.trang_thai === 'approved').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-emerald-600">
            {(bookings
              .filter(b => b.trang_thai === 'approved' || b.trang_thai === 'completed')
              .reduce((sum, b) => sum + b.tong_tien, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bookings

