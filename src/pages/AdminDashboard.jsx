import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Shield, User, LayoutDashboard, Building2, DoorOpen, Users as UsersIcon, Percent, Trophy, Calendar } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import NotificationBell from '../components/notifications/NotificationBell'
import Rooms from './admin-hotel/Rooms'
import Discounts from './admin-hotel/Discounts'
import Users from './admin-hotel/Users'
import Hotels from './admin-hotel/Hotels'
import Overview from './admin-hotel/Overview'
import Bookings from './admin-hotel/Bookings'
import AdminProfilePage from './admin/AdminProfilePage'

const sections = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'hotels', label: 'Quản lý khách sạn', icon: Building2 },
  { id: 'rooms', label: 'Quản lý phòng', icon: DoorOpen },
  { id: 'users', label: 'Quản lý người dùng', icon: UsersIcon },
  { id: 'discounts', label: 'Quản lý mã giảm giá', icon: Percent },
  { id: 'ranking', label: 'Bảng xếp hạng', icon: Trophy },
  { id: 'bookings', label: 'Quản lý đặt phòng', icon: Calendar }
]

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()
  
  // Get active section from URL or default to 'overview'
  const getActiveSection = () => {
    const pathParts = location.pathname.split('/').filter(Boolean)
    const adminIndex = pathParts.indexOf('admin-hotel')
    if (adminIndex !== -1 && pathParts[adminIndex + 1]) {
      const section = pathParts[adminIndex + 1]
      // Check if section is in sections array or is 'profile'
      if (section === 'profile' || sections.find(s => s.id === section)) {
        return section
      }
    }
    return 'overview'
  }
  
  const [activeSection, setActiveSection] = useState(getActiveSection())

  // Update active section when URL changes
  useEffect(() => {
    setActiveSection(getActiveSection())
  }, [location.pathname])

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId)
    navigate(`/admin-hotel/${sectionId}`)
  }

  const handleAvatarClick = () => {
    setActiveSection('profile')
    navigate('/admin-hotel/profile')
  }

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout()
      navigate('/admin/login')
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />
      case 'hotels':
        return <Hotels />
      case 'rooms':
        return <Rooms />
      case 'discounts':
        return <Discounts />
      case 'users':
        return <Users />
      case 'bookings':
        return <Bookings />
      case 'profile':
        return <AdminProfilePage />
      default:
        return (
          <div className="p-12 text-center text-slate-500">
            Chức năng <strong>{sections.find((s) => s.id === activeSection)?.label}</strong> sẽ cập nhật sau.
          </div>
        )
    }
  }

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 100
      }
    })
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-200 flex">
      <motion.aside
        className="w-64 bg-slate-900 text-white flex flex-col"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="px-6 py-6 border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold tracking-wide">TripHotel</h1>
          {user && (
            <motion.p
              className="text-sm text-slate-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {user.ho_ten || user.email}
            </motion.p>
          )}
        </motion.div>
        <nav className="flex-1 px-3 py-5 space-y-2">
          {sections.map(({ id, label, icon: Icon }, index) => (
            <motion.button
              key={id}
              onClick={() => handleSectionChange(id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden group ${
                activeSection === id 
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/50' 
                  : 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
              }`}
              variants={menuItemVariants}
              custom={index}
              whileHover={{ 
                x: 5, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              {/* Active indicator bar */}
              {activeSection === id && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Content */}
              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={activeSection === id ? { 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon 
                    size={20} 
                    className={activeSection === id ? 'text-white' : 'text-slate-400 group-hover:text-white'} 
                  />
                </motion.div>
                <span className="flex-1">{label}</span>
                
                {/* Active indicator dot */}
                {activeSection === id && (
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  />
                )}
              </div>
              
              {/* Ripple effect on click */}
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scale: 0, opacity: 0.5 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          ))}
        </nav>
        <motion.div
          className="p-4 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} />
            Đăng xuất
          </motion.button>
        </motion.div>
      </motion.aside>

      <main className="flex-1 p-8 relative">
        {/* Notification Bell and Avatar - Top Right */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-3">
          {/* Notification Bell */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <NotificationBell />
          </motion.div>
          
          {/* Avatar Button */}
          <motion.button
            onClick={handleAvatarClick}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-sky-500 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            type="button"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.ho_ten || 'Admin'}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center pointer-events-none">
                <Shield className="text-white" size={24} />
              </div>
            )}
          </motion.button>
        </div>

        <motion.div
          className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(15,23,42,0.08)] border border-slate-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  )
}

export default AdminDashboard

