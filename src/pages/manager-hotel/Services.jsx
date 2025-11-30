import React, { useState, useEffect } from 'react'
import { Plus, Loader2, Edit, Trash2, X, Wifi, Car, Utensils, Dumbbell, Coffee, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const USE_MOCK_DATA = true

// Mock services data
const mockServices = [
  {
    ma_dich_vu: 1,
    ten_dich_vu: 'WiFi miễn phí',
    mo_ta: 'WiFi tốc độ cao trong toàn bộ khách sạn',
    gia: 0,
    trang_thai: 1, // 1 = hoạt động, 0 = tạm dừng
    icon: 'wifi'
  },
  {
    ma_dich_vu: 2,
    ten_dich_vu: 'Đưa đón sân bay',
    mo_ta: 'Dịch vụ đưa đón sân bay 24/7',
    gia: 200000,
    trang_thai: 1,
    icon: 'car'
  },
  {
    ma_dich_vu: 3,
    ten_dich_vu: 'Nhà hàng',
    mo_ta: 'Nhà hàng phục vụ buffet sáng và các bữa ăn',
    gia: 0,
    trang_thai: 1,
    icon: 'utensils'
  },
  {
    ma_dich_vu: 4,
    ten_dich_vu: 'Phòng gym',
    mo_ta: 'Phòng tập gym hiện đại với đầy đủ thiết bị',
    gia: 0,
    trang_thai: 1,
    icon: 'dumbbell'
  },
  {
    ma_dich_vu: 5,
    ten_dich_vu: 'Spa & Massage',
    mo_ta: 'Dịch vụ spa và massage thư giãn',
    gia: 500000,
    trang_thai: 1,
    icon: 'spa'
  },
  {
    ma_dich_vu: 6,
    ten_dich_vu: 'Quầy bar',
    mo_ta: 'Quầy bar phục vụ đồ uống và cocktail',
    gia: 0,
    trang_thai: 0,
    icon: 'coffee'
  }
]

const iconMap = {
  wifi: Wifi,
  car: Car,
  utensils: Utensils,
  dumbbell: Dumbbell,
  spa: Sparkles, // Using Sparkles as alternative for Spa
  coffee: Coffee
}

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [formData, setFormData] = useState({
    ten_dich_vu: '',
    mo_ta: '',
    gia: '',
    trang_thai: 1,
    icon: 'wifi'
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setServices(mockServices)
      }
    } catch (err) {
      console.error('Error fetching services:', err)
      toast.error('Không thể tải danh sách dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = () => {
    setIsAddModalOpen(true)
    setFormData({
      ten_dich_vu: '',
      mo_ta: '',
      gia: '',
      trang_thai: 1,
      icon: 'wifi'
    })
    setFormErrors({})
  }

  const handleEdit = (id) => {
    const service = services.find(s => s.ma_dich_vu === id)
    if (service) {
      setEditingServiceId(id)
      setFormData({
        ten_dich_vu: service.ten_dich_vu || '',
        mo_ta: service.mo_ta || '',
        gia: service.gia?.toString() || '',
        trang_thai: service.trang_thai ?? 1,
        icon: service.icon || 'wifi'
      })
      setFormErrors({})
      setIsEditModalOpen(true)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.ten_dich_vu.trim()) {
      errors.ten_dich_vu = 'Vui lòng nhập tên dịch vụ'
    }
    
    if (!formData.mo_ta.trim()) {
      errors.mo_ta = 'Vui lòng nhập mô tả'
    }
    
    if (formData.gia === '' || parseFloat(formData.gia) < 0) {
      errors.gia = 'Vui lòng nhập giá hợp lệ (>= 0)'
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
        const updatedService = {
          ten_dich_vu: formData.ten_dich_vu.trim(),
          mo_ta: formData.mo_ta.trim(),
          gia: parseFloat(formData.gia) || 0,
          trang_thai: parseInt(formData.trang_thai),
          icon: formData.icon
        }

        if (USE_MOCK_DATA) {
          setServices(services.map(s => 
            s.ma_dich_vu === editingServiceId 
              ? { ...s, ...updatedService }
              : s
          ))
          toast.success('Cập nhật dịch vụ thành công!')
        }
        setIsEditModalOpen(false)
      } else {
        const newService = {
          ma_dich_vu: services.length > 0 
            ? Math.max(...services.map(s => s.ma_dich_vu)) + 1 
            : 1,
          ten_dich_vu: formData.ten_dich_vu.trim(),
          mo_ta: formData.mo_ta.trim(),
          gia: parseFloat(formData.gia) || 0,
          trang_thai: parseInt(formData.trang_thai),
          icon: formData.icon
        }

        if (USE_MOCK_DATA) {
          setServices([newService, ...services])
          toast.success('Thêm dịch vụ thành công!')
        }
        setIsAddModalOpen(false)
      }

      setFormData({
        ten_dich_vu: '',
        mo_ta: '',
        gia: '',
        trang_thai: 1,
        icon: 'wifi'
      })
    } catch (err) {
      toast.error('Lỗi: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      try {
        if (USE_MOCK_DATA) {
          setServices(services.filter(s => s.ma_dich_vu !== id))
          toast.success('Xóa dịch vụ thành công!')
        }
      } catch (err) {
        toast.error('Lỗi khi xóa dịch vụ')
      }
    }
  }

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const ServiceModal = ({ isOpen, onClose, isEdit }) => {
    const IconComponent = iconMap[formData.icon] || Wifi

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_dich_vu}
                  onChange={(e) => setFormData({...formData, ten_dich_vu: e.target.value})}
                  placeholder="VD: WiFi miễn phí"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    formErrors.ten_dich_vu ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.ten_dich_vu && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.ten_dich_vu}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}
                  placeholder="Mô tả về dịch vụ..."
                  rows="3"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    formErrors.mo_ta ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.mo_ta && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.mo_ta}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.gia}
                    onChange={(e) => setFormData({...formData, gia: e.target.value})}
                    placeholder="0 = miễn phí"
                    min="0"
                    step="1000"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.gia ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.gia && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.gia}</p>
                  )}
                  {formData.gia && !formErrors.gia && (
                    <p className="text-slate-500 text-sm mt-1">
                      {formatPrice(parseFloat(formData.gia) || 0)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="wifi">WiFi</option>
                    <option value="car">Xe đưa đón</option>
                    <option value="utensils">Nhà hàng</option>
                    <option value="dumbbell">Gym</option>
                    <option value="spa">Spa</option>
                    <option value="coffee">Bar/Cafe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({...formData, trang_thai: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Tạm dừng</option>
                  </select>
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
                  {isEdit ? 'Cập nhật' : 'Thêm dịch vụ'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
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
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Dịch vụ khách sạn</h1>
          <p className="text-slate-500 mt-1">Quản lý các dịch vụ của khách sạn</p>
        </div>
        <motion.button 
          onClick={handleAddService}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Thêm dịch vụ
        </motion.button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Wifi
          
          return (
            <motion.div
              key={service.ma_dich_vu}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <IconComponent className="w-6 h-6 text-emerald-600" />
                </div>
                {service.trang_thai === 1 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    Tạm dừng
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">{service.ten_dich_vu}</h3>
              <p className="text-slate-600 mb-4">{service.mo_ta}</p>
              <p className="text-lg font-semibold text-emerald-600 mb-4">
                {formatPrice(service.gia)}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <motion.button
                  onClick={() => handleEdit(service.ma_dich_vu)}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit size={16} />
                  Sửa
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(service.ma_dich_vu)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <ServiceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        isEdit={false}
      />

      <ServiceModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingServiceId(null)
        }} 
        isEdit={true}
      />
    </div>
  )
}

export default Services

