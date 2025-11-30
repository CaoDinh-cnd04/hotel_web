import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation } from 'react-query'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Lock,
  Building2
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

const ManagerProfilePage = () => {
  const { user, updateUser } = useAuthStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  
  const [profileData, setProfileData] = useState({
    ho_ten: user?.ho_ten || '',
    email: user?.email || '',
    so_dien_thoai: user?.so_dien_thoai || '',
    dia_chi: user?.dia_chi || '',
    ngay_sinh: user?.ngay_sinh || '',
    gioi_tinh: user?.gioi_tinh || 'Nam',
    avatar: user?.avatar || null
  })

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Fetch manager profile - using mock data from auth store
  const { data: profile, isLoading } = useQuery(
    'manager-profile',
    () => {
      // Mock API call, return user data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { data: user } })
        }, 500)
      })
    },
    {
      select: (data) => data.data?.data || user,
      onSuccess: (data) => {
        if (data) {
          setProfileData({
            ho_ten: data.ho_ten || '',
            email: data.email || '',
            so_dien_thoai: data.so_dien_thoai || '',
            dia_chi: data.dia_chi || '',
            ngay_sinh: data.ngay_sinh || '',
            gioi_tinh: data.gioi_tinh || 'Nam',
            avatar: data.avatar || null
          })
          setAvatarPreview(data.avatar || null)
        }
      }
    }
  )

  // Update profile mutation - using mock for now
  const updateProfileMutation = useMutation(
    (data) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { data } })
        }, 1000)
      })
    },
    {
      onSuccess: (response) => {
        toast.success('Cập nhật thông tin thành công!')
        updateUser(response.data.data)
        setIsEditing(false)
      },
      onError: (error) => {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin')
      }
    }
  )

  // Change password mutation - using mock for now
  const changePasswordMutation = useMutation(
    (data) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { message: 'Đổi mật khẩu thành công' } })
        }, 1000)
      })
    },
    {
      onSuccess: () => {
        toast.success('Đổi mật khẩu thành công!')
        setIsChangePasswordModalOpen(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      },
      onError: (error) => {
        toast.error(error.message || 'Có lỗi xảy ra')
      }
    }
  )

  const handleUpdateProfile = () => {
    if (!profileData.ho_ten || !profileData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    // Validate birth date
    if (profileData.ngay_sinh) {
      const birthDate = new Date(profileData.ngay_sinh)
      const today = new Date()
      const minDate = new Date('1940-01-01')
      
      if (birthDate < minDate) {
        toast.error('Ngày sinh không hợp lệ')
        return
      }
      
      if (birthDate > today) {
        toast.error('Ngày sinh không hợp lệ')
        return
      }

      // Check if age is reasonable (between 13-120 years old)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 13) {
        toast.error('Tuổi phải từ 13 trở lên')
        return
      }
      if (age > 120) {
        toast.error('Ngày sinh không hợp lệ')
        return
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      toast.error('Email không hợp lệ')
      return
    }

    // Validate phone number if provided
    if (profileData.so_dien_thoai) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(profileData.so_dien_thoai.replace(/\s/g, ''))) {
        toast.error('Số điện thoại không hợp lệ')
        return
      }
    }

    updateProfileMutation.mutate(profileData)
  }

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    changePasswordMutation.mutate({
      mat_khau_cu: passwordData.currentPassword,
      mat_khau_moi: passwordData.newPassword
    })
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WEBP)')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setAvatarPreview(imageUrl)
        setProfileData(prev => ({
          ...prev,
          avatar: imageUrl
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setProfileData(prev => ({
      ...prev,
      avatar: null
    }))
    // Clear file input
    const fileInput = document.getElementById('manager-avatar-upload')
    if (fileInput) fileInput.value = ''
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setAvatarPreview(profile?.avatar || null)
    setProfileData({
      ho_ten: profile?.ho_ten || '',
      email: profile?.email || '',
      so_dien_thoai: profile?.so_dien_thoai || '',
      dia_chi: profile?.dia_chi || '',
      ngay_sinh: profile?.ngay_sinh || '',
      gioi_tinh: profile?.gioi_tinh || 'Nam',
      avatar: profile?.avatar || null
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="text-emerald-600" size={32} />
          <h1 className="text-3xl font-bold text-slate-900">Hồ sơ Manager</h1>
        </div>
        <p className="text-slate-600">Quản lý thông tin cá nhân và cài đặt tài khoản quản lý khách sạn</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-row items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Thông tin cá nhân</h2>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updateProfileMutation.isLoading}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Hủy
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={updateProfileMutation.isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        {updateProfileMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{ 
                        width: '96px', 
                        height: '96px', 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                      }}
                    >
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Building2 size={48} color="#64748b" />
                      )}
                    </div>
                    {isEditing && (
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '0', 
                        right: '0' 
                      }}>
                        <input
                          type="file"
                          id="manager-avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="manager-avatar-upload"
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Camera size={16} />
                        </label>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: '1' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          value={profileData.ho_ten}
                          onChange={(e) => setProfileData({...profileData, ho_ten: e.target.value})}
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#0f172a',
                            backgroundColor: 'transparent',
                            borderBottom: '1px solid #cbd5e1',
                            outline: 'none',
                            width: '100%',
                            padding: '4px 0'
                          }}
                          placeholder="Nhập họ tên"
                        />
                        <p style={{ color: '#64748b', margin: '0' }}>{profile?.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Quản lý khách sạn
                        </span>
                        {avatarPreview && (
                          <button
                            onClick={handleRemoveAvatar}
                            style={{
                              color: '#ef4444',
                              fontSize: '14px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0'
                            }}
                          >
                            <X size={12} />
                            Xóa ảnh đại diện
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: '#0f172a',
                          margin: '0 0 4px 0'
                        }}>
                          {profileData.ho_ten || profile?.ho_ten || 'Chưa cập nhật'}
                        </h3>
                        <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>{profile?.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                          Quản lý khách sạn
                        </span>
                        <p style={{ 
                          fontSize: '14px', 
                          color: '#94a3b8',
                          margin: '0'
                        }}>
                          Thành viên từ {new Date(profile?.created_at || Date.now()).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                      <Mail style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#94a3b8', 
                        width: '16px', 
                        height: '16px',
                        zIndex: 1
                      }} />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Nhập email"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Số điện thoại
                    </label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                      <Phone style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#94a3b8', 
                        width: '16px', 
                        height: '16px',
                        zIndex: 1
                      }} />
                      <input
                        type="tel"
                        value={profileData.so_dien_thoai}
                        onChange={(e) => setProfileData({...profileData, so_dien_thoai: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Nhập số điện thoại"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={profileData.gioi_tinh}
                      onChange={(e) => setProfileData({...profileData, gioi_tinh: e.target.value})}
                      disabled={!isEditing}
                      className="w-full h-10 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ngày sinh
                    </label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                      <Calendar style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#94a3b8', 
                        width: '16px', 
                        height: '16px',
                        zIndex: 1
                      }} />
                      <input
                        type="date"
                        value={profileData.ngay_sinh}
                        min="1940-01-01"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setProfileData({...profileData, ngay_sinh: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Địa chỉ
                    </label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                      <MapPin style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#94a3b8', 
                        width: '16px', 
                        height: '16px',
                        zIndex: 1
                      }} />
                      <input
                        type="text"
                        value={profileData.dia_chi}
                        onChange={(e) => setProfileData({...profileData, dia_chi: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Nhập địa chỉ"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security & Settings */}
        <div className="space-y-6">
          {/* Account Security */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Bảo mật tài khoản</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="w-full flex items-center justify-start px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </button>
                
                <div className="text-sm text-slate-500 pt-4 border-t border-slate-200">
                  <p>Đăng nhập lần cuối: </p>
                  <p className="font-medium text-slate-700">
                    {new Date().toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Thống kê tài khoản</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Vai trò:</span>
                  <span className="font-semibold text-emerald-600">Quản lý khách sạn</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Trạng thái:</span>
                  <span className="font-semibold text-emerald-600">Hoạt động</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Ngày tạo:</span>
                  <span className="font-semibold">
                    {new Date(profile?.created_at || Date.now()).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Đổi mật khẩu</h3>
              <button
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsChangePasswordModalOpen(false)}
                disabled={changePasswordMutation.isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {changePasswordMutation.isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ManagerProfilePage



