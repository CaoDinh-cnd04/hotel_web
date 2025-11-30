import React, { useState, useEffect } from 'react'
import { Plus, Printer, Loader2, Edit, Trash2, Bed, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const USE_MOCK_DATA = true

// Mock rooms data for manager's hotel
const mockRooms = [
  {
    ma_phong: 1,
    so_phong: '101',
    ten_phong: 'Phòng Deluxe View Sông',
    ma_loai_phong: 6,
    gia_phong: 1500000,
    trang_thai: 1, // 1 = đã đặt, 0 = trống
    mo_ta: 'Phòng view sông đẹp, có ban công riêng',
    tien_ich: ['WiFi', 'TV', 'Minibar', 'Điều hòa']
  },
  {
    ma_phong: 2,
    so_phong: '102',
    ten_phong: 'Phòng Superior',
    ma_loai_phong: 6,
    gia_phong: 1200000,
    trang_thai: 0,
    mo_ta: 'Phòng tiêu chuẩn, view thành phố',
    tien_ich: ['WiFi', 'TV', 'Điều hòa']
  },
  {
    ma_phong: 3,
    so_phong: '201',
    ten_phong: 'Phòng Gia Đình',
    ma_loai_phong: 4,
    gia_phong: 2500000,
    trang_thai: 1,
    mo_ta: 'Phòng rộng rãi cho gia đình, có giường phụ',
    tien_ich: ['WiFi', 'TV', 'Minibar', 'Điều hòa', 'Bếp nhỏ']
  },
  {
    ma_phong: 4,
    so_phong: '202',
    ten_phong: 'Phòng Deluxe',
    ma_loai_phong: 6,
    gia_phong: 1800000,
    trang_thai: 0,
    mo_ta: 'Phòng cao cấp với view đẹp',
    tien_ich: ['WiFi', 'TV', 'Minibar', 'Điều hòa', 'Bồn tắm']
  },
  {
    ma_phong: 5,
    so_phong: '301',
    ten_phong: 'Phòng Suite',
    ma_loai_phong: 5,
    gia_phong: 3000000,
    trang_thai: 0,
    mo_ta: 'Phòng suite sang trọng, có phòng khách riêng',
    tien_ich: ['WiFi', 'TV', 'Minibar', 'Điều hòa', 'Bồn tắm', 'Phòng khách']
  },
  {
    ma_phong: 6,
    so_phong: '302',
    ten_phong: 'Phòng Premium',
    ma_loai_phong: 8,
    gia_phong: 2200000,
    trang_thai: 1,
    mo_ta: 'Phòng premium với đầy đủ tiện nghi',
    tien_ich: ['WiFi', 'TV', 'Minibar', 'Điều hòa', 'Bồn tắm', 'Ban công']
  }
]

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
    ma_loai_phong: '',
    gia_phong: '',
    trang_thai: 0,
    mo_ta: '',
    tien_ich: []
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
        await new Promise(resolve => setTimeout(resolve, 500))
        setRooms(mockRooms)
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
      ma_loai_phong: '',
      gia_phong: '',
      trang_thai: 0,
      mo_ta: '',
      tien_ich: []
    })
    setFormErrors({})
  }

  const handleEdit = (id) => {
    const room = rooms.find(r => r.ma_phong === id)
    if (room) {
      setEditingRoomId(id)
      setFormData({
        so_phong: room.so_phong || '',
        ten_phong: room.ten_phong || '',
        ma_loai_phong: room.ma_loai_phong?.toString() || '',
        gia_phong: room.gia_phong?.toString() || '',
        trang_thai: room.trang_thai ?? 0,
        mo_ta: room.mo_ta || '',
        tien_ich: room.tien_ich || []
      })
      setFormErrors({})
      setIsEditModalOpen(true)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.so_phong.trim()) {
      errors.so_phong = 'Vui lòng nhập số phòng'
    }
    
    if (!formData.ten_phong.trim()) {
      errors.ten_phong = 'Vui lòng nhập tên phòng'
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
      if (isEditModalOpen) {
        // Update room
        const updatedRoom = {
          so_phong: formData.so_phong.trim(),
          ten_phong: formData.ten_phong.trim(),
          ma_loai_phong: parseInt(formData.ma_loai_phong),
          gia_phong: parseFloat(formData.gia_phong),
          trang_thai: parseInt(formData.trang_thai),
          mo_ta: formData.mo_ta.trim(),
          tien_ich: formData.tien_ich
        }

        if (USE_MOCK_DATA) {
          setRooms(rooms.map(r => 
            r.ma_phong === editingRoomId 
              ? { ...r, ...updatedRoom }
              : r
          ))
          toast.success('Cập nhật phòng thành công!')
        }
        setIsEditModalOpen(false)
      } else {
        // Add new room
        const newRoom = {
          ma_phong: rooms.length > 0 
            ? Math.max(...rooms.map(r => r.ma_phong)) + 1 
            : 1,
          so_phong: formData.so_phong.trim(),
          ten_phong: formData.ten_phong.trim(),
          ma_loai_phong: parseInt(formData.ma_loai_phong),
          gia_phong: parseFloat(formData.gia_phong),
          trang_thai: parseInt(formData.trang_thai),
          mo_ta: formData.mo_ta.trim(),
          tien_ich: formData.tien_ich
        }

        if (USE_MOCK_DATA) {
          setRooms([newRoom, ...rooms])
          toast.success('Thêm phòng thành công!')
        }
        setIsAddModalOpen(false)
      }

      setFormData({
        so_phong: '',
        ten_phong: '',
        ma_loai_phong: '',
        gia_phong: '',
        trang_thai: 0,
        mo_ta: '',
        tien_ich: []
      })
    } catch (err) {
      toast.error('Lỗi: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng này?')) {
      try {
        if (USE_MOCK_DATA) {
          setRooms(rooms.filter(room => room.ma_phong !== id))
          toast.success('Xóa phòng thành công!')
        }
      } catch (err) {
        toast.error('Lỗi khi xóa phòng: ' + (err.message || 'Vui lòng thử lại'))
      }
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const getRoomTypeName = (typeId) => {
    const types = {
      1: 'Phòng Đơn',
      2: 'Phòng Đôi',
      3: 'Phòng Twin',
      4: 'Phòng Gia Đình',
      5: 'Phòng Suite',
      6: 'Phòng Deluxe',
      7: 'Phòng Executive',
      8: 'Phòng Premium'
    }
    return types[typeId] || 'N/A'
  }

  const filteredRooms = rooms.filter(room => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      room.so_phong?.toLowerCase().includes(search) ||
      room.ten_phong?.toLowerCase().includes(search) ||
      room.mo_ta?.toLowerCase().includes(search)
    )
  })

  const RoomModal = ({ isOpen, onClose, isEdit }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {isEdit ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.so_phong}
                    onChange={(e) => setFormData({...formData, so_phong: e.target.value})}
                    placeholder="VD: 101, 201..."
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.so_phong ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.so_phong && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.so_phong}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tên phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ten_phong}
                    onChange={(e) => setFormData({...formData, ten_phong: e.target.value})}
                    placeholder="VD: Phòng Deluxe View Sông"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.ten_phong ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.ten_phong && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.ten_phong}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Loại phòng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.ma_loai_phong}
                    onChange={(e) => setFormData({...formData, ma_loai_phong: e.target.value})}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
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
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.gia_phong ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.gia_phong && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.gia_phong}</p>
                  )}
                  {formData.gia_phong && !formErrors.gia_phong && (
                    <p className="text-slate-500 text-sm mt-1">
                      {formatPrice(parseFloat(formData.gia_phong) || 0)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({...formData, trang_thai: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value={0}>Trống</option>
                    <option value={1}>Đã đặt</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.mo_ta}
                    onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}
                    placeholder="Mô tả về phòng..."
                    rows="3"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  {isEdit ? 'Cập nhật phòng' : 'Thêm phòng'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý phòng</h1>
          <p className="text-slate-500 mt-1">Quản lý phòng của khách sạn</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleAddRoom}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            Thêm Phòng
          </motion.button>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500 text-white font-semibold shadow hover:bg-slate-600 transition-colors"
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
            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchRooms}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Số phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Tên phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Loại phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Giá phòng</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">Trạng thái</th>
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
                    <motion.tr
                      key={room.ma_phong}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{room.so_phong}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{room.ten_phong}</p>
                          {room.mo_ta && (
                            <p className="text-xs text-slate-500 mt-1">{room.mo_ta}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">{getRoomTypeName(room.ma_loai_phong)}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-emerald-600">{formatPrice(room.gia_phong)}</td>
                      <td className="py-4 px-4">
                        {room.trang_thai === 1 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            <Bed size={14} />
                            Đã đặt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <CheckCircle size={14} />
                            Trống
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <motion.button
                            onClick={() => handleEdit(room.ma_phong)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit size={14} />
                            Sửa
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(room.ma_phong)}
                            className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={14} />
                            Xóa
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      <RoomModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        isEdit={false}
      />

      {/* Edit Room Modal */}
      <RoomModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingRoomId(null)
        }} 
        isEdit={true}
      />
    </div>
  )
}

export default Rooms

