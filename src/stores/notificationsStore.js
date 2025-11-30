import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useNotificationsStore = create(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 1,
          title: 'Đặt phòng thành công',
          message: 'Bạn đã đặt phòng tại Grand Palace Hotel thành công',
          type: 'booking',
          isRead: false,
          createdAt: '2024-11-13T10:30:00Z',
          relatedId: 'booking_001'
        },
        {
          id: 2,
          title: 'Khuyến mãi mới',
          message: 'Giảm 30% cho tất cả khách sạn 5 sao trong tháng 11',
          type: 'promotion',
          isRead: false,
          createdAt: '2024-11-13T09:15:00Z',
          relatedId: null
        },
        {
          id: 3,
          title: 'Nhắc nhở thanh toán',
          message: 'Vui lòng thanh toán cho đơn đặt phòng #002 trước 15/11',
          type: 'payment',
          isRead: true,
          createdAt: '2024-11-12T14:20:00Z',
          relatedId: 'booking_002'
        },
        {
          id: 4,
          title: 'Check-in sắp tới',
          message: 'Bạn có lịch check-in tại Ocean View Resort vào ngày mai',
          type: 'reminder',
          isRead: false,
          createdAt: '2024-11-11T16:45:00Z',
          relatedId: 'booking_003'
        }
      ],

      // Actions
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now(),
          isRead: false,
          createdAt: new Date().toISOString(),
          ...notification
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === id 
              ? { ...notification, isRead: true }
              : notification
          )
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            isRead: true
          }))
        }))
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }))
      },

      clearAllNotifications: () => {
        set({ notifications: [] })
      },

      getUnreadCount: () => {
        return get().notifications.filter(notification => !notification.isRead).length
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter(notification => notification.type === type)
      },

      // Simulate adding booking notification
      addBookingNotification: (bookingData) => {
        const notification = {
          title: 'Đặt phòng mới',
          message: `Bạn đã đặt phòng tại ${bookingData.hotelName} thành công`,
          type: 'booking',
          relatedId: bookingData.id
        }
        get().addNotification(notification)
      },

      // Simulate adding payment notification
      addPaymentNotification: (paymentData) => {
        const notification = {
          title: paymentData.status === 'success' ? 'Thanh toán thành công' : 'Thanh toán thất bại',
          message: paymentData.status === 'success' 
            ? `Thanh toán ${paymentData.amount?.toLocaleString()}₫ đã được xử lý thành công`
            : `Có lỗi xảy ra khi thanh toán. Vui lòng thử lại`,
          type: 'payment',
          relatedId: paymentData.bookingId
        }
        get().addNotification(notification)
      }
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({ notifications: state.notifications })
    }
  )
)

export { useNotificationsStore }