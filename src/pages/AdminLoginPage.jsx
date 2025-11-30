import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!loginData.email || !loginData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const result = await login({
      email: loginData.email,
      mat_khau: loginData.password
    })

    if (result.success) {
      // Check if user is admin
      const { isAdmin } = useAuthStore.getState()
      if (isAdmin()) {
        toast.success('Đăng nhập admin thành công!')
        navigate('/admin-hotel')
      } else {
        toast.error('Bạn không có quyền truy cập trang admin. Vui lòng đăng nhập bằng tài khoản admin.')
        // Logout non-admin users
        await useAuthStore.getState().logout()
      }
    } else {
      toast.error(result.error || 'Đăng nhập thất bại')
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

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 }
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
            Đăng nhập Admin
          </motion.h2>
          <motion.p
            className="text-slate-400 text-sm"
            variants={itemVariants}
          >
            Vui lòng đăng nhập để truy cập bảng điều khiển quản trị
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200"
          variants={cardVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: { duration: 0.3 }
          }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <motion.div
              variants={itemVariants}
              initial="blur"
              whileFocus="focus"
            >
              <motion.label
                className="block text-sm font-semibold text-slate-700 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Email
              </motion.label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  animate={{
                    color: loginData.email ? "#0ea5e9" : "#94a3b8"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail size={20} />
                </motion.div>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Nhập email admin"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              variants={itemVariants}
              initial="blur"
              whileFocus="focus"
            >
              <motion.label
                className="block text-sm font-semibold text-slate-700 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Mật khẩu
              </motion.label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  animate={{
                    color: loginData.password ? "#0ea5e9" : "#94a3b8"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock size={20} />
                </motion.div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Nhập mật khẩu"
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
              </motion.div>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden"
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
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
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
              Chưa có tài khoản?{' '}
              <Link
                to="/admin/register"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Đăng ký ngay
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
            <motion.div
              className="text-xs text-slate-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Chỉ dành cho quản trị viên
            </motion.div>
            <motion.div
              className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <strong>Test:</strong> Email: <code className="text-sky-600">admin@triphotel.com</code> hoặc <code className="text-sky-600">admin@admin.com</code>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default AdminLoginPage

