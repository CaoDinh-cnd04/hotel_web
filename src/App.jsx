import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AuthPage from './pages/AuthPage'
import HotelsPage from './pages/HotelsPage'
import HotelDetailPage from './pages/HotelDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import BookingsPage from './pages/BookingsPage'
import PaymentPage from './pages/PaymentPage'
import PromotionsPage from './pages/PromotionsPage'
import ContactPage from './pages/ContactPage'
import NotificationsPage from './pages/NotificationsPage'
import TestAPI from './pages/TestAPI'
import TestPage from './pages/TestPage'
import SimpleHotelDetailPage from './pages/SimpleHotelDetailPage'
import HotelManagementPage from './pages/HotelManagementPage'
// Admin Pages
import Overview from './pages/admin/Overview'
import Hotels from './pages/admin/Hotels'
import Users from './pages/admin/Users'
import Rooms from './pages/admin/Rooms'
import Discounts from './pages/admin/Discounts'
import Bookings from './pages/admin/Bookings'
import Reviews from './pages/admin/Reviews'
import AdminDashboard from './pages/AdminDashboard'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminRegisterPage from './pages/AdminRegisterPage'
import ManagerDashboard from './pages/ManagerDashboard'
import ManagerLoginPage from './pages/ManagerLoginPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

// Auth Route Component (redirect to home if already logged in)
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  return !isAuthenticated() ? children : <Navigate to="/" replace />
}

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore()
  
  // Debug: Log authentication status
  React.useEffect(() => {
    console.log('AdminProtectedRoute - isAuthenticated:', isAuthenticated())
    console.log('AdminProtectedRoute - isAdmin:', isAdmin())
    console.log('AdminProtectedRoute - user:', useAuthStore.getState().user)
  }, [])
  
  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to /admin/login')
    return <Navigate to="/admin/login" replace />
  }
  
  if (!isAdmin()) {
    console.log('Not admin, redirecting to /')
    return <Navigate to="/" replace />
  }
  
  return children
}

// Manager Protected Route Component
const ManagerProtectedRoute = ({ children }) => {
  const { isAuthenticated, isHotelManager } = useAuthStore()
  
  // Debug: Log authentication status
  React.useEffect(() => {
    console.log('ManagerProtectedRoute - isAuthenticated:', isAuthenticated())
    console.log('ManagerProtectedRoute - isHotelManager:', isHotelManager())
    console.log('ManagerProtectedRoute - user:', useAuthStore.getState().user)
  }, [])
  
  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to /manager/login')
    return <Navigate to="/manager/login" replace />
  }
  
  // Temporarily allow access for testing - remove this later
  // if (!isHotelManager()) {
  //   console.log('Not hotel manager, redirecting to /')
  //   return <Navigate to="/" replace />
  // }
  
  return <ErrorBoundary>{children}</ErrorBoundary>
}

function App() {
  const { initializeAuth } = useAuthStore()
  
  // Initialize auth on app start
  React.useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <div className="App">
      <ErrorBoundary>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/hotels" element={<Layout><HotelsPage /></Layout>} />
        <Route path="/hotels/:id" element={<Layout><HotelDetailPage /></Layout>} />
        <Route path="/simple-hotel/:id" element={<Layout><SimpleHotelDetailPage /></Layout>} />
        <Route path="/search" element={<Layout><SearchResultsPage /></Layout>} />
        <Route path="/promotions" element={<Layout><PromotionsPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />
        <Route path="/test-api" element={<Layout><TestAPI /></Layout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        } />
        
        {/* Admin Auth Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        
        {/* Manager Auth Routes */}
        <Route path="/manager/login" element={<ManagerLoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute>
            <Layout><BookingsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/payment/:bookingId" element={
          <ProtectedRoute>
            <Layout><PaymentPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Layout><NotificationsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/test" element={<Layout><TestPage /></Layout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/overview" element={
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        } />
        <Route path="/admin/hotels" element={
          <ProtectedRoute>
            <Hotels />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/admin/rooms" element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        } />
        <Route path="/admin/discounts" element={
          <ProtectedRoute>
            <Discounts />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        } />
        
        {/* Admin Hotel Dashboard Routes */}
        <Route path="/admin-hotel" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin-hotel/:section" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        
        {/* Manager Routes */}
        <Route path="/manager-hotel" element={
          <ManagerProtectedRoute>
            <ErrorBoundary>
              <ManagerDashboard />
            </ErrorBoundary>
          </ManagerProtectedRoute>
        } />
        <Route path="/manager-hotel/:section" element={
          <ManagerProtectedRoute>
            <ErrorBoundary>
              <ManagerDashboard />
            </ErrorBoundary>
          </ManagerProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App