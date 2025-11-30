import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Shield, User, Phone } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const AdminRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerData, setRegisterData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    password: '',
    confirmPassword: ''
  })
  
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!registerData.ho_ten || !registerData.email || !registerData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (registerData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      toast.error('Email không hợp lệ')
      return
    }

    // Check if email is admin email
    const isAdminEmail = registerData.email === 'admin@triphotel.com' || 
                        registerData.email === 'admin@admin.com' ||
                        registerData.email.includes('@admin.')
    
    if (!isAdminEmail) {
      toast.error('Email phải là email admin (ví dụ: admin@triphotel.com hoặc @admin.*)')
      return
    }

    const result = await register({
      ho_ten: registerData.ho_ten,
      email: registerData.email,
      so_dien_thoai: registerData.so_dien_thoai,
      mat_khau: registerData.password,
      gioi_tinh: 'Nam',
      chuc_vu: 'Admin' // Force Admin role for admin registration
    })

    if (result.success) {
      toast.success('Đăng ký tài khoản admin thành công!')
      navigate('/admin-hotel')
    } else {
      toast.error(result.error || 'Đăng ký thất bại')
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="w-full max-w-md relative z-10"
        variants={itemVariants}
      >
        {/* Logo and Header */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-2xl mb-4 shadow-lg"
            variants={logoVariants}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="text-white" size={32} />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            variants={itemVariants}
          >
            TripHotel
          </motion.h1>
          <motion.h2
            className="text-xl font-semibold text-slate-300 mb-2"
            variants={itemVariants}
          >
            Đăng ký Admin
          </motion.h2>
          <motion.p
            className="text-slate-400 text-sm"
            variants={itemVariants}
          >
            Tạo tài khoản quản trị viên mới
          </motion.p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200"
          variants={cardVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { duration: 0.3 }
          }}
        >
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Họ tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-slate-400" size={20} />
                </div>
                <input
                  type="text"
                  value={registerData.ho_ten}
                  onChange={(e) => setRegisterData({...registerData, ho_ten: e.target.value})}
                  placeholder="Nhập họ tên"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                  required
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={20} />
                </div>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  placeholder="admin@triphotel.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Phải là email admin (ví dụ: admin@triphotel.com hoặc @admin.*)
              </p>
            </motion.div>

            {/* Phone Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="text-slate-400" size={20} />
                </div>
                <input
                  type="tel"
                  value={registerData.so_dien_thoai}
                  onChange={(e) => setRegisterData({...registerData, so_dien_thoai: e.target.value})}
                  placeholder="Nhập số điện thoại"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-slate-400" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-slate-400" size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden mt-6"
              variants={itemVariants}
              whileHover={!isLoading ? {
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)"
              } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {!isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              )}
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <motion.svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng ký Admin'
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer Links */}
          <motion.div
            className="mt-6 text-center space-y-2"
            variants={itemVariants}
          >
            <p className="text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Link
                to="/admin/login"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
            <motion.a
              href="/"
              className="text-sm text-slate-500 hover:text-sky-600 transition-colors inline-block"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Quay lại trang chủ
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default AdminRegisterPage



