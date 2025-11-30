import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Printer, Loader2, X } from 'lucide-react'
import { roomAPI } from '../../../admin_hotel/src/services/api'
import { mockRooms, mockHotels } from '../../../admin_hotel/src/data/mockData'
import toast from 'react-hot-toast'

const USE_MOCK_DATA = true // Set to false when API is ready

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [formData, setFormData] = useState({
    so_phong: '',
    ten_phong: '',
    ma_khach_san: '',
    ma_loai_phong: '',
    gia_phong: '',
    trang_thai: 1
  })
  const [formErrors, setFormErrors] = useState({})

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
    setIsAddModalOpen(true)
    setFormData({
      so_phong: '',
      ten_phong: '',
      ma_khach_san: '',
      ma_loai_phong: '',
      gia_phong: '',
      trang_thai: 1
    })
    setFormErrors({})
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.so_phong.trim()) {
      errors.so_phong = 'Vui lòng nhập số phòng'
    }
    
    if (!formData.ten_phong.trim()) {
      errors.ten_phong = 'Vui lòng nhập tên phòng'
    }
    
    if (!formData.ma_khach_san) {
      errors.ma_khach_san = 'Vui lòng chọn khách sạn'
    }
    
    if (!formData.ma_loai_phong) {
      errors.ma_loai_phong = 'Vui lòng chọn loại phòng'
    }
    
    if (!formData.gia_phong || parseFloat(formData.gia_phong) <= 0) {
      errors.gia_phong = 'Vui lòng nhập giá phòng hợp lệ'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const newRoom = {
        ma_phong: rooms.length > 0 
          ? Math.max(...rooms.map(r => r.ma_phong || r.id)) + 1 
          : 1,
        so_phong: formData.so_phong.trim(),
        ten_phong: formData.ten_phong.trim(),
        ma_khach_san: parseInt(formData.ma_khach_san),
        ma_loai_phong: parseInt(formData.ma_loai_phong),
        gia_phong: parseFloat(formData.gia_phong),
        trang_thai: parseInt(formData.trang_thai)
      }

      if (USE_MOCK_DATA) {
        setRooms([newRoom, ...rooms])
        toast.success('Thêm phòng thành công!')
      } else {
        await roomAPI.create(newRoom)
        await fetchRooms()
        toast.success('Thêm phòng thành công!')
      }

      setIsAddModalOpen(false)
      setFormData({
        so_phong: '',
        ten_phong: '',
        ma_khach_san: '',
        ma_loai_phong: '',
        gia_phong: '',
        trang_thai: 1
      })
    } catch (err) {
      toast.error('Lỗi khi thêm phòng: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setFormData({
      so_phong: '',
      ten_phong: '',
      ma_khach_san: '',
      ma_loai_phong: '',
      gia_phong: '',
      trang_thai: 1
    })
    setFormErrors({})
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = (id) => {
    const room = rooms.find(r => (r.ma_phong || r.id) === id)
    if (room) {
      setEditingRoomId(id)
      setFormData({
        so_phong: room.so_phong || '',
        ten_phong: room.ten_phong || '',
        ma_khach_san: room.ma_khach_san?.toString() || '',
        ma_loai_phong: room.ma_loai_phong?.toString() || '',
        gia_phong: room.gia_phong?.toString() || '',
        trang_thai: room.trang_thai ?? 1
      })
      setFormErrors({})
      setIsEditModalOpen(true)
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const updatedRoom = {
        so_phong: formData.so_phong.trim(),
        ten_phong: formData.ten_phong.trim(),
        ma_khach_san: parseInt(formData.ma_khach_san),
        ma_loai_phong: parseInt(formData.ma_loai_phong),
        gia_phong: parseFloat(formData.gia_phong),
        trang_thai: parseInt(formData.trang_thai)
      }

      if (USE_MOCK_DATA) {
        setRooms(rooms.map(r => 
          (r.ma_phong || r.id) === editingRoomId 
            ? { ...r, ...updatedRoom }
            : r
        ))
        toast.success('Cập nhật phòng thành công!')
      } else {
        await roomAPI.update(editingRoomId, updatedRoom)
        await fetchRooms()
        toast.success('Cập nhật phòng thành công!')
      }

      setIsEditModalOpen(false)
      setEditingRoomId(null)
      setFormData({
        so_phong: '',
        ten_phong: '',
        ma_khach_san: '',
        ma_loai_phong: '',
        gia_phong: '',
        trang_thai: 1
      })
    } catch (err) {
      toast.error('Lỗi khi cập nhật phòng: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingRoomId(null)
    setFormData({
      so_phong: '',
      ten_phong: '',
      ma_khach_san: '',
      ma_loai_phong: '',
      gia_phong: '',
      trang_thai: 1
    })
    setFormErrors({})
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

      {/* Add Room Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Thêm phòng mới</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Số phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.so_phong}
                      onChange={(e) => setFormData({...formData, so_phong: e.target.value})}
                      placeholder="VD: 101, 201, 301..."
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.so_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.so_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.so_phong}</p>
                    )}
                  </div>

                  {/* Tên phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tên phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ten_phong}
                      onChange={(e) => setFormData({...formData, ten_phong: e.target.value})}
                      placeholder="VD: Phòng Deluxe View Sông"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.ten_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.ten_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ten_phong}</p>
                    )}
                  </div>

                  {/* Khách sạn */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Khách sạn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ma_khach_san}
                      onChange={(e) => setFormData({...formData, ma_khach_san: e.target.value})}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.ma_khach_san ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">-- Chọn khách sạn --</option>
                      {mockHotels.map((hotel) => (
                        <option key={hotel.ma_khach_san} value={hotel.ma_khach_san}>
                          {hotel.ten_khach_san}
                        </option>
                      ))}
                    </select>
                    {formErrors.ma_khach_san && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ma_khach_san}</p>
                    )}
                  </div>

                  {/* Loại phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Loại phòng <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ma_loai_phong}
                      onChange={(e) => setFormData({...formData, ma_loai_phong: e.target.value})}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.ma_loai_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">-- Chọn loại phòng --</option>
                      <option value="1">Phòng Đơn (Single)</option>
                      <option value="2">Phòng Đôi (Double)</option>
                      <option value="3">Phòng Twin</option>
                      <option value="4">Phòng Gia Đình (Family)</option>
                      <option value="5">Phòng Suite</option>
                      <option value="6">Phòng Deluxe</option>
                      <option value="7">Phòng Executive</option>
                      <option value="8">Phòng Premium</option>
                    </select>
                    {formErrors.ma_loai_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ma_loai_phong}</p>
                    )}
                  </div>

                  {/* Giá phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Giá phòng (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.gia_phong}
                      onChange={(e) => setFormData({...formData, gia_phong: e.target.value})}
                      placeholder="VD: 1500000"
                      min="0"
                      step="1000"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.gia_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.gia_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.gia_phong}</p>
                    )}
                    {formData.gia_phong && !formErrors.gia_phong && (
                      <p className="text-slate-500 text-sm mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(formData.gia_phong) || 0)}
                      </p>
                    )}
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.trang_thai}
                      onChange={(e) => setFormData({...formData, trang_thai: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Không hoạt động</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-lg"
                  >
                    Thêm phòng
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Chỉnh sửa phòng</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Số phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.so_phong}
                      onChange={(e) => setFormData({...formData, so_phong: e.target.value})}
                      placeholder="VD: 101, 201, 301..."
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.so_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.so_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.so_phong}</p>
                    )}
                  </div>

                  {/* Tên phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tên phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ten_phong}
                      onChange={(e) => setFormData({...formData, ten_phong: e.target.value})}
                      placeholder="VD: Phòng Deluxe View Sông"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.ten_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.ten_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ten_phong}</p>
                    )}
                  </div>

                  {/* Khách sạn */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Khách sạn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ma_khach_san}
                      onChange={(e) => setFormData({...formData, ma_khach_san: e.target.value})}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.ma_khach_san ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">-- Chọn khách sạn --</option>
                      {mockHotels.map((hotel) => (
                        <option key={hotel.ma_khach_san} value={hotel.ma_khach_san}>
                          {hotel.ten_khach_san}
                        </option>
                      ))}
                    </select>
                    {formErrors.ma_khach_san && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ma_khach_san}</p>
                    )}
                  </div>

                  {/* Loại phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Loại phòng <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ma_loai_phong}
                      onChange={(e) => setFormData({...formData, ma_loai_phong: e.target.value})}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.ma_loai_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">-- Chọn loại phòng --</option>
                      <option value="1">Phòng Đơn (Single)</option>
                      <option value="2">Phòng Đôi (Double)</option>
                      <option value="3">Phòng Twin</option>
                      <option value="4">Phòng Gia Đình (Family)</option>
                      <option value="5">Phòng Suite</option>
                      <option value="6">Phòng Deluxe</option>
                      <option value="7">Phòng Executive</option>
                      <option value="8">Phòng Premium</option>
                    </select>
                    {formErrors.ma_loai_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ma_loai_phong}</p>
                    )}
                  </div>

                  {/* Giá phòng */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Giá phòng (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.gia_phong}
                      onChange={(e) => setFormData({...formData, gia_phong: e.target.value})}
                      placeholder="VD: 1500000"
                      min="0"
                      step="1000"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                        formErrors.gia_phong ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.gia_phong && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.gia_phong}</p>
                    )}
                    {formData.gia_phong && !formErrors.gia_phong && (
                      <p className="text-slate-500 text-sm mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(formData.gia_phong) || 0)}
                      </p>
                    )}
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.trang_thai}
                      onChange={(e) => setFormData({...formData, trang_thai: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Không hoạt động</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-lg"
                  >
                    Cập nhật phòng
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Rooms
