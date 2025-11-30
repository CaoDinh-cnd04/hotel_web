import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
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
  Lock
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { userAPI } from '../services/api'
import Button from '../components/ui/Button'
import { Input, Label } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/ui/Modal'
import { useTranslation } from '../hooks/useTranslation'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  
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

  // Fetch user profile - using mock data from user store
  const { data: profile, isLoading } = useQuery(
    'user-profile',
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

  // Change password mutation
  const changePasswordMutation = useMutation(
    (data) => userAPI.changePassword(data),
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
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
      }
    }
  )

  const handleUpdateProfile = () => {
    if (!profileData.ho_ten || !profileData.email) {
      toast.error(t('fillRequiredInfo'))
      return
    }

    // Validate birth date
    if (profileData.ngay_sinh) {
      const birthDate = new Date(profileData.ngay_sinh)
      const today = new Date()
      const minDate = new Date('1940-01-01')
      
      if (birthDate < minDate) {
        toast.error(t('invalidBirthDate'))
        return
      }
      
      if (birthDate > today) {
        toast.error(t('invalidBirthDate'))
        return
      }

      // Check if age is reasonable (between 13-120 years old)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 13) {
        toast.error(t('ageRestriction'))
        return
      }
      if (age > 120) {
        toast.error(t('invalidBirthDate'))
        return
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      toast.error(t('invalidEmail'))
      return
    }

    // Validate phone number if provided
    if (profileData.so_dien_thoai) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(profileData.so_dien_thoai.replace(/\s/g, ''))) {
        toast.error(t('invalidPhone'))
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
    const fileInput = document.getElementById('avatar-upload')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ của tôi</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={updateProfileMutation.isLoading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUpdateProfile}
                          disabled={updateProfileMutation.isLoading}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {updateProfileMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                      <div 
                        style={{ 
                          width: '96px', 
                          height: '96px', 
                          backgroundColor: '#f3f4f6', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: '2px solid #e5e7eb'
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
                          <User size={48} color="#6b7280" />
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
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                          />
                          <label
                            htmlFor="avatar-upload"
                            style={{
                              backgroundColor: '#6366f1',
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
                              color: '#111827',
                              backgroundColor: 'transparent',
                              borderBottom: '1px solid #d1d5db',
                              outline: 'none',
                              width: '100%',
                              padding: '4px 0'
                            }}
                            placeholder="Nhập họ tên"
                          />
                          <p style={{ color: '#6b7280', margin: '0' }}>{profile?.email}</p>
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
                            color: '#111827',
                            margin: '0 0 4px 0'
                          }}>
                            {profileData.ho_ten || profile?.ho_ten || 'Chưa cập nhật'}
                          </h3>
                          <p style={{ color: '#6b7280', margin: '0 0 4px 0' }}>{profile?.email}</p>
                          <p style={{ 
                            fontSize: '14px', 
                            color: '#9ca3af',
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
                      <Label htmlFor="email">Email *</Label>
                      <div style={{ position: 'relative', marginTop: '4px' }}>
                        <Mail style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: '#9ca3af', 
                          width: '16px', 
                          height: '16px',
                          zIndex: 1
                        }} />
                        <input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                          placeholder="Nhập email"
                          style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '40px',
                            paddingRight: '12px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: !isEditing ? '#f9fafb' : 'white',
                            color: '#111827',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                      <div style={{ position: 'relative', marginTop: '4px' }}>
                        <Phone style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: '#9ca3af', 
                          width: '16px', 
                          height: '16px',
                          zIndex: 1
                        }} />
                        <input
                          id="so_dien_thoai"
                          type="tel"
                          value={profileData.so_dien_thoai}
                          onChange={(e) => setProfileData({...profileData, so_dien_thoai: e.target.value})}
                          disabled={!isEditing}
                          placeholder="Nhập số điện thoại"
                          style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '40px',
                            paddingRight: '12px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: !isEditing ? '#f9fafb' : 'white',
                            color: '#111827',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gioi_tinh">Giới tính</Label>
                      <select
                        id="gioi_tinh"
                        value={profileData.gioi_tinh}
                        onChange={(e) => setProfileData({...profileData, gioi_tinh: e.target.value})}
                        disabled={!isEditing}
                        className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="ngay_sinh">Ngày sinh</Label>
                      <div style={{ position: 'relative', marginTop: '4px' }}>
                        <Calendar style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: '#9ca3af', 
                          width: '16px', 
                          height: '16px',
                          zIndex: 1
                        }} />
                        <input
                          id="ngay_sinh"
                          type="date"
                          value={profileData.ngay_sinh}
                          min="1940-01-01"
                          max={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setProfileData({...profileData, ngay_sinh: e.target.value})}
                          disabled={!isEditing}
                          style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '40px',
                            paddingRight: '12px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: !isEditing ? '#f9fafb' : 'white',
                            color: '#111827',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="dia_chi">Địa chỉ</Label>
                      <div style={{ position: 'relative', marginTop: '4px' }}>
                        <MapPin style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: '#9ca3af', 
                          width: '16px', 
                          height: '16px',
                          zIndex: 1
                        }} />
                        <input
                          id="dia_chi"
                          type="text"
                          value={profileData.dia_chi}
                          onChange={(e) => setProfileData({...profileData, dia_chi: e.target.value})}
                          disabled={!isEditing}
                          placeholder="Nhập địa chỉ"
                          style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '40px',
                            paddingRight: '12px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: !isEditing ? '#f9fafb' : 'white',
                            color: '#111827',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    <p>Đăng nhập lần cuối: </p>
                    <p className="font-medium">
                      {new Date().toLocaleString('vi-VN')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng số đặt phòng:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Khách sạn yêu thích:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Điểm tích lũy:</span>
                    <span className="font-semibold text-primary-600">0 điểm</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal 
          isOpen={isChangePasswordModalOpen} 
          onClose={() => setIsChangePasswordModalOpen(false)}
        >
          <ModalHeader>
            <h3 className="text-lg font-semibold">Đổi mật khẩu</h3>
          </ModalHeader>
          
          <ModalContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>
          </ModalContent>
          
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordModalOpen(false)}
              disabled={changePasswordMutation.isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isLoading}
            >
              {changePasswordMutation.isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default ProfilePage