import { useState, useEffect } from 'react'
import { Plus, Printer, Loader2 } from 'lucide-react'
import { roomAPI } from '../services/api'
import { mockRooms } from '../data/mockData'

const USE_MOCK_DATA = true // Set to false when API is ready

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredRooms = rooms.filter(room => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      room.so_phong?.toLowerCase().includes(search) ||
      room.ten_phong?.toLowerCase().includes(search) ||
      room.ma_khach_san?.toString().includes(search)
    )
  })

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

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
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
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Tên phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Số phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Khách sạn</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Loại phòng</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      {searchTerm ? 'Không tìm thấy phòng nào' : 'Chưa có phòng nào'}
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.ma_phong || room.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{room.ma_phong || room.id}</td>
                      <td className="py-4 px-4 text-sm text-slate-700">{room.ten_phong || room.so_phong || 'N/A'}</td>
                      <td className="py-4 px-4 text-sm text-slate-700">{room.so_phong || 'N/A'}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{room.ma_khach_san || 'N/A'}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{room.ma_loai_phong || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(room.ma_phong || room.id)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(room.ma_phong || room.id)}
                            className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
