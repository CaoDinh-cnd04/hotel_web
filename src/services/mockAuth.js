// Mock authentication service for development
export const mockAuthAPI = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (!credentials.email || !credentials.mat_khau) {
      throw new Error('Email và mật khẩu không được để trống')
    }
    
    // Check for admin login
    const isAdmin = credentials.email === 'admin@triphotel.com' || 
                    credentials.email === 'admin@admin.com' ||
                    credentials.email.includes('@admin.')
    
    // Check for manager login
    const isManager = credentials.email === 'manager@triphotel.com' || 
                      credentials.email === 'manager@manager.com' ||
                      credentials.email.includes('@manager.')
    
    // Determine role
    let chuc_vu = 'User'
    let ho_ten = 'Người dùng test'
    let id = 1
    
    if (isAdmin) {
      chuc_vu = 'Admin'
      ho_ten = 'Quản trị viên'
      id = 999
    } else if (isManager) {
      chuc_vu = 'HotelManager'
      ho_ten = 'Quản lý khách sạn'
      id = 888
    }
    
    // Mock successful login
    const mockUser = {
      id: id,
      ho_ten: ho_ten,
      email: credentials.email,
      so_dien_thoai: '0123456789',
      gioi_tinh: 'Nam',
      ngay_sinh: '1990-05-15',
      chuc_vu: chuc_vu,
      avatar: null,
      created_at: '2024-01-01T00:00:00.000Z'
    }
    
    return {
      data: {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      }
    }
  },

  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (!userData.ho_ten || !userData.email || !userData.mat_khau) {
      throw new Error('Vui lòng điền đầy đủ thông tin')
    }
    
    if (userData.mat_khau.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
    }
    
    // Check for duplicate email (mock)
    if (userData.email === 'test@test.com') {
      throw new Error('Email này đã được sử dụng')
    }
    
    // Check if user is registering as admin
    const isAdmin = userData.chuc_vu === 'Admin' || 
                    userData.email === 'admin@triphotel.com' || 
                    userData.email === 'admin@admin.com' ||
                    userData.email.includes('@admin.')
    
    // Check if user is registering as manager
    const isManager = userData.chuc_vu === 'HotelManager' || 
                      userData.email === 'manager@triphotel.com' || 
                      userData.email === 'manager@manager.com' ||
                      userData.email.includes('@manager.')
    
    // Determine role
    let chuc_vu = userData.chuc_vu || 'User'
    if (isAdmin) {
      chuc_vu = 'Admin'
    } else if (isManager) {
      chuc_vu = 'HotelManager'
    }
    
    // Mock successful registration
    const mockUser = {
      id: Date.now(),
      ho_ten: userData.ho_ten,
      email: userData.email,
      so_dien_thoai: userData.so_dien_thoai || '',
      gioi_tinh: userData.gioi_tinh || 'Nam',
      chuc_vu: chuc_vu,
      avatar: null,
      created_at: new Date().toISOString()
    }
    
    return {
      data: {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      }
    }
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { data: { message: 'Đăng xuất thành công' } }
  }
}