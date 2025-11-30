import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import { mockAuthAPI } from '../services/mockAuth'

// Use mock API for development
const API = mockAuthAPI

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await API.login(credentials)
          const { user, token } = response.data

          set({ 
            user, 
            token, 
            isLoading: false, 
            error: null 
          })

          // Store token in localStorage for API requests
          localStorage.setItem('auth_token', token)
          
          return { success: true, user }
        } catch (error) {
          const errorMessage = error.message || 'Đăng nhập thất bại'
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          return { success: false, error: errorMessage }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await API.register(userData)
          const { user, token } = response.data

          set({ 
            user, 
            token, 
            isLoading: false, 
            error: null 
          })

          localStorage.setItem('auth_token', token)
          
          return { success: true, user }
        } catch (error) {
          const errorMessage = error.message || 'Đăng ký thất bại'
          set({ 
            error: errorMessage, 
            isLoading: false 
          })
          return { success: false, error: errorMessage }
        }
      },

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ 
            user: null, 
            token: null, 
            error: null 
          })
          localStorage.removeItem('auth_token')
        }
      },

      clearError: () => set({ error: null }),

      // Utility methods
      isAuthenticated: () => {
        const state = get()
        return !!state.user && !!state.token
      },

      isAdmin: () => {
        const state = get()
        return state.user?.chuc_vu === 'Admin'
      },

      isHotelManager: () => {
        const state = get()
        return state.user?.chuc_vu === 'HotelManager'
      },

      isUser: () => {
        const state = get()
        return state.user?.chuc_vu === 'User'
      },

      hasRole: (role) => {
        const state = get()
        return state.user?.chuc_vu === role
      },

      // Update user profile
      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }))
      },

      // Initialize from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          set({ token })
        }
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const state = get()
        return !!state.token && !!state.user
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
)

export { useAuthStore }