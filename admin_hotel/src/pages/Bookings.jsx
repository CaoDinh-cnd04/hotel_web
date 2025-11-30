import { useState, useEffect, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { bookingAPI } from '../services/api'
import { mockBookings, mockHotels } from '../data/mockData'
import FilterBar from '../components/FilterBar'

const USE_MOCK_DATA = true // Set to false when API is ready

const statusColors = {
  'Đã xác nhận': 'bg-emerald-100 text-emerald-700',
  'Chờ xử lý': 'bg-amber-100 text-amber-700',
  'Đã hủy': 'bg-rose-100 text-rose-700',
  'confirmed': 'bg-emerald-100 text-emerald-700',
  'pending': 'bg-amber-100 text-amber-700',
  'cancelled': 'bg-rose-100 text-rose-700'
}

const getStatusLabel = (status) => {
  const statusMap = {
    'confirmed': 'Đã xác nhận',
    'pending': 'Chờ xử lý',
    'cancelled': 'Đã hủy',
    'checked_in': 'Đã nhận phòng',
    'checked_out': 'Đã trả phòng'
  }
  return statusMap[status] || status || 'Chờ xử lý'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('vi-VN').format(price)
}

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: 'Tất cả',
    location: 'Tất cả',
    hotel_id: 'all',
    dateRange: 'Tất cả',
    search: ''
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setBookings(mockBookings)
      } else {
        const response = await bookingAPI.getAll()
        const bookingsData = response.data || response || []
        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách đặt phòng')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings]

    // Filter by status
    if (filters.status !== 'Tất cả') {
      filtered = filtered.filter(b => {
        const status = b.trang_thai || b.status || 'pending'
        const statusLabel = getStatusLabel(status)
        return statusLabel === filters.status || status === filters.status
      })
    }

    // Filter by hotel
    if (filters.hotel_id !== 'all') {
      filtered = filtered.filter(b => (b.ma_khach_san || b.hotel_id) === parseInt(filters.hotel_id))
    }

    // Filter by location (through hotel)
    if (filters.location !== 'Tất cả') {
      filtered = filtered.filter(b => {
        const hotel = mockHotels.find(h => (h.ma_khach_san || h.id) === (b.ma_khach_san || b.hotel_id))
        if (!hotel) return false
        const address = (hotel.dia_chi || hotel.address || '').toLowerCase()
        return address.includes(filters.location.toLowerCase())
      })
    }

    // Filter by date range
    if (filters.dateRange !== 'Tất cả') {
      const now = new Date()
      filtered = filtered.filter(b => {
        const checkIn = b.ngay_checkin ? new Date(b.ngay_checkin) : null
        if (!checkIn) return true
        
        switch (filters.dateRange) {
          case 'Hôm nay':
            return checkIn.toDateString() === now.toDateString()
          case 'Tuần này':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
            return checkIn >= weekStart
          case 'Tháng này':
            return checkIn.getMonth() === now.getMonth() && checkIn.getFullYear() === now.getFullYear()
          case 'Sắp tới':
            return checkIn > now
          default:
            return true
        }
      })
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(b => {
        const hotel = mockHotels.find(h => (h.ma_khach_san || h.id) === (b.ma_khach_san || b.hotel_id))
        return (
          (b.ma_phieu_dat || b.id || '').toString().includes(search) ||
          (b.ho_ten || b.guestName || '').toLowerCase().includes(search) ||
          (hotel && (hotel.ten_khach_san || hotel.name || '').toLowerCase().includes(search))
        )
      })
    }

    return filtered
  }, [bookings, filters])

  const confirmedCount = filteredBookings.filter(
    (b) => (b.trang_thai || b.status) === 'confirmed' || (b.trang_thai || b.status) === 'Đã xác nhận'
  ).length

  const handleUpdateStatus = (id, newStatus) => {
    if (USE_MOCK_DATA) {
      setBookings(bookings.map(booking => 
        (booking.ma_phieu_dat || booking.id) === id 
          ? { ...booking, trang_thai: newStatus, status: newStatus }
          : booking
      ))
      alert('Cập nhật trạng thái thành công!')
    } else {
      bookingAPI.updateStatus(id, newStatus)
        .then(() => {
          fetchBookings()
          alert('Cập nhật trạng thái thành công!')
        })
        .catch(err => {
          alert('Lỗi khi cập nhật trạng thái: ' + (err.message || 'Vui lòng thử lại'))
        })
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý đặt phòng</h1>
          <p className="text-slate-500 mt-1">
            Theo dõi trạng thái đơn đặt phòng, ngày nhận/trả phòng và doanh thu.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="inline-flex flex-col px-4 py-2 rounded-xl bg-slate-900 text-white">
            <span className="text-xs text-white/70">Tổng đơn</span>
            <span className="text-xl font-bold">{bookings.length}</span>
          </div>
          <div className="inline-flex flex-col px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700">
            <span className="text-xs">Đã xác nhận</span>
            <span className="text-xl font-bold">{confirmedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        options={{
          showRating: false,
          showLocation: true,
          showReviewCount: false,
          showStatus: true,
          showHotel: true,
          showDateRange: true,
          showSearch: true,
          statusOptions: ['Tất cả', 'Đã xác nhận', 'Chờ xử lý', 'Đã hủy'],
          hotelOptions: mockHotels.map(h => ({ id: h.ma_khach_san || h.id, name: h.ten_khach_san || h.name })),
          searchPlaceholder: 'Tìm theo mã đơn, tên khách hàng, khách sạn...',
          title: 'Bộ lọc đặt phòng',
          description: 'Lọc đơn đặt phòng theo trạng thái, khách sạn, địa điểm và thời gian.'
        }}
      />

      <section className="bg-white border border-slate-200 rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-slate-100 bg-sky-600 text-white rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Danh sách đặt phòng</h2>
            <p className="text-sm text-white/80">Quản lý tất cả đơn đặt phòng trong hệ thống</p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-sky-500" size={32} />
            <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-sky-500 text-white text-sm uppercase tracking-wide">
                  <th className="py-3 px-4 text-left">Mã đơn</th>
                  <th className="py-3 px-4 text-left">Khách sạn</th>
                  <th className="py-3 px-4 text-left">Khách hàng</th>
                  <th className="py-3 px-4 text-left">Nhận phòng</th>
                  <th className="py-3 px-4 text-left">Trả phòng</th>
                  <th className="py-3 px-4 text-left">Số phòng</th>
                  <th className="py-3 px-4 text-left">Tổng tiền (VND)</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      {filters.search || filters.status !== 'Tất cả' || filters.hotel_id !== 'all' || filters.location !== 'Tất cả'
                        ? 'Không tìm thấy đơn đặt phòng nào phù hợp với bộ lọc'
                        : 'Chưa có đơn đặt phòng nào'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const bookingId = booking.ma_phieu_dat || booking.id || 'N/A'
                    const status = booking.trang_thai || booking.status || 'pending'
                    const statusLabel = getStatusLabel(status)
                    const checkIn = booking.ngay_checkin 
                      ? new Date(booking.ngay_checkin).toLocaleDateString('vi-VN')
                      : booking.checkIn || 'N/A'
                    const checkOut = booking.ngay_checkout
                      ? new Date(booking.ngay_checkout).toLocaleDateString('vi-VN')
                      : booking.checkOut || 'N/A'
                    const total = formatPrice(booking.tong_tien || booking.total || 0)

                    return (
                      <tr key={bookingId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">{bookingId}</td>
                        <td className="py-4 px-4 text-sm text-slate-900 font-semibold">
                          {booking.ten_khach_san || booking.hotel || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {booking.ho_ten || booking.guestName || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">{checkIn}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{checkOut}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {booking.so_phong || booking.rooms || 1}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-900">{total}</td>
                        <td className="py-4 px-4 text-sm text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[status] || statusColors[statusLabel] || statusColors['Chờ xử lý']
                          }`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(bookingId, 'confirmed')}
                                className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                              >
                                Xác nhận
                              </button>
                            )}
                            {status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Bạn có chắc muốn hủy đơn này?')) {
                                    handleUpdateStatus(bookingId, 'cancelled')
                                  }
                                }}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                              >
                                Hủy
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Bookings


