import { useState, useEffect, useMemo } from 'react'
import { Plus, Printer, Loader2, CheckCircle, XCircle, CreditCard, Wallet, Banknote, Building2 } from 'lucide-react'
import { roomAPI } from '../../services/admin/api'
import { mockRooms, mockHotels } from '../../data/admin/mockData'
import FilterBar from '../../components/admin/FilterBar'

const USE_MOCK_DATA = true // Set to false when API is ready

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    rating: 'Tất cả',
    location: 'Tất cả',
    reviewCount: 'Tất cả',
    search: '',
    hotel_id: 'all',
    priceRange: 'Tất cả',
    coTheHuy: 'Tất cả',
    trangThaiSuDung: 'Tất cả',
    trangThaiThanhToan: 'Tất cả',
    phuongThucThanhToan: 'Tất cả'
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setRooms(mockRooms)
      } else {
        const response = await roomAPI.getAll()
        // Transform API response to match our format
        const roomsData = response.data || response || []
        setRooms(Array.isArray(roomsData) ? roomsData : [])
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách phòng')
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRoom = () => {
    const newRoom = {
      ma_phong: rooms.length > 0 
        ? Math.max(...rooms.map(r => r.ma_phong || r.id)) + 1 
        : 1,
      so_phong: `P${String(rooms.length + 1).padStart(3, '0')}`,
      ten_phong: 'Phòng mới',
      ma_khach_san: 1,
      ma_loai_phong: 6,
      gia_phong: 1000000,
      trang_thai: 1
    }
    setRooms([newRoom, ...rooms])
    alert('Thêm phòng thành công! Vui lòng chỉnh sửa thông tin phòng.')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = (id) => {
    const room = rooms.find(r => (r.ma_phong || r.id) === id)
    if (room) {
      const newName = prompt('Nhập tên phòng mới:', room.ten_phong || room.so_phong)
      if (newName && newName.trim()) {
        setRooms(rooms.map(r => 
          (r.ma_phong || r.id) === id 
            ? { ...r, ten_phong: newName.trim() }
            : r
        ))
        alert('Cập nhật tên phòng thành công!')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng này?')) {
      try {
        if (USE_MOCK_DATA) {
          setRooms(rooms.filter(room => (room.ma_phong || room.id) !== id))
          alert('Xóa phòng thành công!')
        } else {
          await roomAPI.delete(id)
          setRooms(rooms.filter(room => (room.ma_phong || room.id) !== id))
          alert('Xóa phòng thành công!')
        }
      } catch (err) {
        alert('Lỗi khi xóa phòng: ' + (err.message || 'Vui lòng thử lại'))
      }
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  // Get hotel info for filtering
  const getHotelInfo = (hotelId) => {
    return mockHotels.find(h => (h.ma_khach_san || h.id) === hotelId)
  }

  const filteredRooms = useMemo(() => {
    let filtered = [...rooms]

    // Filter by hotel
    if (filters.hotel_id !== 'all') {
      filtered = filtered.filter(r => (r.ma_khach_san || r.hotel_id) === parseInt(filters.hotel_id))
    }

    // Filter by location (through hotel)
    if (filters.location !== 'Tất cả') {
      filtered = filtered.filter(r => {
        const hotel = getHotelInfo(r.ma_khach_san || r.hotel_id)
        if (!hotel) return false
        const address = (hotel.dia_chi || hotel.address || '').toLowerCase()
        return address.includes(filters.location.toLowerCase())
      })
    }

    // Filter by rating (through hotel)
    if (filters.rating !== 'Tất cả') {
      const ratingValue = parseInt(filters.rating.replace(' sao', ''))
      filtered = filtered.filter(r => {
        const hotel = getHotelInfo(r.ma_khach_san || r.hotel_id)
        if (!hotel) return false
        return (hotel.so_sao || hotel.stars || 0) === ratingValue
      })
    }

    // Filter by price range
    if (filters.priceRange !== 'Tất cả') {
      filtered = filtered.filter(r => {
        const price = r.gia_phong || r.price || 0
        switch (filters.priceRange) {
          case 'Dưới 1 triệu':
            return price < 1000000
          case '1-2 triệu':
            return price >= 1000000 && price < 2000000
          case '2-5 triệu':
            return price >= 2000000 && price < 5000000
          case 'Trên 5 triệu':
            return price >= 5000000
          default:
            return true
        }
      })
    }

    // Filter by có thể hủy
    if (filters.coTheHuy !== 'Tất cả') {
      filtered = filtered.filter(r => {
        const coTheHuy = r.co_the_huy || false
        if (filters.coTheHuy === 'Có thể hủy') return coTheHuy === true
        if (filters.coTheHuy === 'Không thể hủy') return coTheHuy === false
        return true
      })
    }

    // Filter by trạng thái sử dụng
    if (filters.trangThaiSuDung !== 'Tất cả') {
      filtered = filtered.filter(r => {
        const trangThai = r.trang_thai_su_dung || 'trống'
        return trangThai === filters.trangThaiSuDung
      })
    }

    // Filter by trạng thái thanh toán
    if (filters.trangThaiThanhToan !== 'Tất cả') {
      filtered = filtered.filter(r => {
        const trangThai = r.trang_thai_thanh_toan || null
        if (filters.trangThaiThanhToan === 'Có thanh toán') {
          return trangThai !== null
        }
        if (filters.trangThaiThanhToan === 'Chưa thanh toán') {
          return trangThai === null || trangThai === 'chưa thanh toán'
        }
        return trangThai === filters.trangThaiThanhToan
      })
    }

    // Filter by phương thức thanh toán
    if (filters.phuongThucThanhToan !== 'Tất cả') {
      filtered = filtered.filter(r => {
        const phuongThuc = r.phuong_thuc_thanh_toan || null
        return phuongThuc === filters.phuongThucThanhToan
      })
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(r => {
        const hotel = getHotelInfo(r.ma_khach_san || r.hotel_id)
        return (
          r.so_phong?.toLowerCase().includes(search) ||
          r.ten_phong?.toLowerCase().includes(search) ||
          (hotel && (hotel.ten_khach_san || hotel.name || '').toLowerCase().includes(search))
        )
      })
    }

    return filtered
  }, [rooms, filters])

  const getStatusBadge = (status) => {
    const statusMap = {
      'trống': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Trống' },
      'đang sử dụng': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang sử dụng' },
      'bảo trì': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Bảo trì' }
    }
    const config = statusMap[status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: status || 'N/A' }
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    if (!status) return <span className="text-xs text-slate-400 italic">-</span>
    const statusMap = {
      'đã thanh toán': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã thanh toán' },
      'chưa thanh toán': { bg: 'bg-red-100', text: 'text-red-700', label: 'Chưa thanh toán' },
      'đang chờ': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Đang chờ' }
    }
    const config = statusMap[status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: status }
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentMethodIcon = (method) => {
    const iconMap = {
      'VNPay': <CreditCard size={14} className="text-blue-600" />,
      'MoMo': <Wallet size={14} className="text-pink-600" />,
      'Tiền mặt': <Banknote size={14} className="text-green-600" />,
      'Chuyển khoản': <Building2 size={14} className="text-purple-600" />
    }
    return iconMap[method] || null
  }

  const getRoomTypeName = (coTheHuy) => {
    if (coTheHuy === true || coTheHuy === 'true' || coTheHuy === 1) {
      return 'Có thể hủy'
    }
    return 'Không thể hủy'
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý phòng</h1>
          <p className="text-slate-500 mt-1">Danh sách phòng hiện có trong hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddRoom}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition-colors"
          >
            <Plus size={18} />
            Thêm Phòng
          </button>
          <button 
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition-colors"
          >
            <Printer size={18} />
            In
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow mb-6">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-900">Bộ lọc phòng</h2>
          <p className="text-sm text-slate-500">Lọc phòng theo khách sạn, trạng thái và thanh toán</p>
        </div>
        <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Khách sạn
            <select
              value={filters.hotel_id}
              onChange={(e) => setFilters({ ...filters, hotel_id: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">Tất cả khách sạn</option>
              {mockHotels.map((hotel) => (
                <option key={hotel.ma_khach_san || hotel.id} value={hotel.ma_khach_san || hotel.id}>
                  {hotel.ten_khach_san || hotel.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Có thể hủy
            <select
              value={filters.coTheHuy}
              onChange={(e) => setFilters({ ...filters, coTheHuy: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Có thể hủy">Có thể hủy</option>
              <option value="Không thể hủy">Không thể hủy</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Trạng thái sử dụng
            <select
              value={filters.trangThaiSuDung}
              onChange={(e) => setFilters({ ...filters, trangThaiSuDung: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="trống">Trống</option>
              <option value="đang sử dụng">Đang sử dụng</option>
              <option value="bảo trì">Bảo trì</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Trạng thái thanh toán
            <select
              value={filters.trangThaiThanhToan}
              onChange={(e) => setFilters({ ...filters, trangThaiThanhToan: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Có thanh toán">Có thanh toán</option>
              <option value="đã thanh toán">Đã thanh toán</option>
              <option value="chưa thanh toán">Chưa thanh toán</option>
              <option value="đang chờ">Đang chờ</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Phương thức thanh toán
            <select
              value={filters.phuongThucThanhToan}
              onChange={(e) => setFilters({ ...filters, phuongThucThanhToan: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="VNPay">VNPay</option>
              <option value="MoMo">MoMo</option>
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Khoảng giá
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Dưới 1 triệu">Dưới 1 triệu</option>
              <option value="1-2 triệu">1-2 triệu</option>
              <option value="2-5 triệu">2-5 triệu</option>
              <option value="Trên 5 triệu">Trên 5 triệu</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            Tìm kiếm
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm theo số phòng, tên phòng, khách sạn..."
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            />
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow">

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-sky-500" size={32} />
            <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchRooms}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-sky-600 text-white">
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Số phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Tên phòng</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Loại phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Khách sạn</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Giá phòng</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Trạng thái</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Thanh toán</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Phương thức</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      {filters.search || filters.hotel_id !== 'all' || filters.coTheHuy !== 'Tất cả' || filters.trangThaiSuDung !== 'Tất cả'
                        ? 'Không tìm thấy phòng nào phù hợp với bộ lọc'
                        : 'Chưa có phòng nào'}
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => {
                    const hotel = getHotelInfo(room.ma_khach_san || room.hotel_id)
                    return (
                      <tr key={room.ma_phong || room.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">{room.ma_phong || room.id}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">{room.so_phong || 'N/A'}</td>
                        <td className="py-4 px-4 text-sm text-slate-700">{room.ten_phong || 'N/A'}</td>
                        <td className="py-4 px-4 text-sm text-center">
                          {room.co_the_huy ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                              <CheckCircle size={12} />
                              Có thể hủy
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                              <XCircle size={12} />
                              Không thể hủy
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {hotel ? (hotel.ten_khach_san || hotel.name) : `KS ${room.ma_khach_san || 'N/A'}`}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-700 text-center font-semibold">
                          {formatPrice(room.gia_phong || room.price)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {getStatusBadge(room.trang_thai_su_dung || 'trống')}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {getPaymentStatusBadge(room.trang_thai_thanh_toan)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {room.phuong_thuc_thanh_toan ? (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700">
                              {getPaymentMethodIcon(room.phuong_thuc_thanh_toan)}
                              <span>{room.phuong_thuc_thanh_toan}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(room.ma_phong || room.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(room.ma_phong || room.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                            >
                              Xóa
                            </button>
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
      </div>
    </div>
  )
}

export default Rooms
