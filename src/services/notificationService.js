import toast from 'react-hot-toast'

class NotificationService {
  constructor() {
    this.notifications = []
    this.listeners = []
  }

  // Send a notification
  sendNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }

    this.notifications.unshift(newNotification)
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(this.notifications))
    
    // Show toast notification
    this.showToast(newNotification)
    
    // Store in localStorage
    this.saveToStorage()
    
    return newNotification
  }

  // Show toast based on notification type
  showToast(notification) {
    const options = {
      duration: 5000,
      position: 'top-right',
    }

    switch (notification.type) {
      case 'booking_confirmed':
        toast.success(notification.message, {
          ...options,
          icon: '✅',
        })
        break
      
      case 'checkout_reminder':
        toast(notification.message, {
          ...options,
          icon: '⏰',
          style: {
            background: '#FFF3CD',
            color: '#856404',
          },
        })
        break
      
      case 'checkout_completed':
        toast.success(notification.message, {
          ...options,
          icon: '🎉',
        })
        break
      
      case 'payment_success':
        toast.success(notification.message, {
          ...options,
          icon: '💳',
        })
        break
      
      case 'payment_failed':
        toast.error(notification.message, {
          ...options,
          icon: '❌',
        })
        break
      
      case 'discount_applied':
        toast.success(notification.message, {
          ...options,
          icon: '🎁',
        })
        break
      
      default:
        toast(notification.message, options)
    }
  }

  // Get all notifications
  getNotifications() {
    return this.notifications
  }

  // Get unread notifications count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.listeners.forEach(listener => listener(this.notifications))
      this.saveToStorage()
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.listeners.forEach(listener => listener(this.notifications))
    this.saveToStorage()
  }

  // Delete notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.listeners.forEach(listener => listener(this.notifications))
    this.saveToStorage()
  }

  // Clear all notifications
  clearAll() {
    this.notifications = []
    this.listeners.forEach(listener => listener(this.notifications))
    this.saveToStorage()
  }

  // Subscribe to notification changes
  subscribe(listener) {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Save to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications))
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error)
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        this.notifications = JSON.parse(stored)
        this.listeners.forEach(listener => listener(this.notifications))
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error)
    }
  }

  // Send booking reminder notifications
  sendBookingReminder(booking) {
    const checkinDate = new Date(booking.checkinDate)
    const now = new Date()
    const daysUntilCheckin = Math.ceil((checkinDate - now) / (1000 * 60 * 60 * 24))

    if (daysUntilCheckin === 1) {
      this.sendNotification({
        type: 'checkin_reminder',
        title: 'Nhắc nhở check-in',
        message: `Ngày mai là ngày check-in tại ${booking.hotelName}. Chúc bạn có chuyến đi vui vẻ!`,
        data: {
          bookingId: booking.id,
          hotelName: booking.hotelName
        }
      })
    }
  }

  // Send payment confirmation
  sendPaymentConfirmation(booking, paymentMethod) {
    this.sendNotification({
      type: 'payment_success',
      title: 'Thanh toán thành công',
      message: `Đã thanh toán ${this.formatPrice(booking.totalPrice)} cho đặt phòng tại ${booking.hotelName} qua ${paymentMethod}`,
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        paymentMethod
      }
    })
  }

  // Send discount notification
  sendDiscountNotification(discountCode, discountAmount) {
    this.sendNotification({
      type: 'discount_applied',
      title: 'Áp dụng mã giảm giá',
      message: `Đã áp dụng mã "${discountCode}" - Giảm ${this.formatPrice(discountAmount)}`,
      data: {
        discountCode,
        discountAmount
      }
    })
  }

  // Helper: Format price
  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }
}

// Create singleton instance
export const notificationService = new NotificationService()

// Load notifications from storage on init
notificationService.loadFromStorage()

export default notificationService
