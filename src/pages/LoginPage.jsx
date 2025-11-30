import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'
import { Input, Label } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  
  const { login, register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const [registerData, setRegisterData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    password: '',
    confirmPassword: '',
    gioi_tinh: 'Nam'
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const result = await login({
      email: formData.email,
      mat_khau: formData.password
    })

    if (result.success) {
      toast.success('Đăng nhập thành công!')
      navigate('/')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
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

    const result = await register({
      ho_ten: registerData.ho_ten,
      email: registerData.email,
      so_dien_thoai: registerData.so_dien_thoai,
      mat_khau: registerData.password,
      gioi_tinh: registerData.gioi_tinh,
      chuc_vu: 'User'
    })

    if (result.success) {
      toast.success('Đăng ký thành công!')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900">TripHotel</span>
              </div>
            </Link>
            
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Chào mừng bạn quay trở lại!' 
                : 'Tạo tài khoản để bắt đầu đặt phòng'
              }
            </p>
          </CardHeader>

          <CardContent>
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Nhập email của bạn"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Nhập mật khẩu"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="ho_ten">Họ tên</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="ho_ten"
                      type="text"
                      value={registerData.ho_ten}
                      onChange={(e) => setRegisterData({...registerData, ho_ten: e.target.value})}
                      placeholder="Nhập họ tên của bạn"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg_email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="reg_email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      placeholder="Nhập email của bạn"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="so_dien_thoai"
                      type="tel"
                      value={registerData.so_dien_thoai}
                      onChange={(e) => setRegisterData({...registerData, so_dien_thoai: e.target.value})}
                      placeholder="Nhập số điện thoại"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gioi_tinh">Giới tính</Label>
                  <select
                    id="gioi_tinh"
                    value={registerData.gioi_tinh}
                    onChange={(e) => setRegisterData({...registerData, gioi_tinh: e.target.value})}
                    className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="reg_password">Mật khẩu</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="reg_password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      placeholder="Nhập lại mật khẩu"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </form>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage