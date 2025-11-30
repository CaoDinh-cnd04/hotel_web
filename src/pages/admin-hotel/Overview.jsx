import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { hotelAPI, userAPI, bookingAPI, statsAPI } from '../../../admin_hotel/src/services/api'
import { mockHotels, mockUsers, mockBookings } from '../../../admin_hotel/src/data/mockData'

const USE_MOCK_DATA = true // Set to false when API is ready

const Overview = () => {
  const [stats, setStats] = useState([
    { label: 'Quản lý khách sạn', value: 0, suffix: 'Khách sạn' },
    { label: 'Quản lý người dùng', value: 0, suffix: 'Người dùng' },
    { label: 'Quản lý đặt phòng', value: 0, suffix: 'Đặt phòng' },
    { label: 'Doanh thu', value: '0.00', suffix: 'Triệu VND' }
  ])
  const [loading, setLoading] = useState(true)
  const [hotelData, setHotelData] = useState([0, 0, 0, 0, 0])
  const [bookingData, setBookingData] = useState([0, 0, 0, 0, 0])

  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5']

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        const hotels = mockHotels
        const users = mockUsers
        const bookings = mockBookings

        // Calculate revenue
        const revenue = bookings.reduce((sum, b) => {
          return sum + (parseFloat(b.tong_tien || b.total || 0))
        }, 0)
        const revenueInMillion = (revenue / 1000000).toFixed(2)

        setStats([
          { label: 'Quản lý khách sạn', value: hotels.length, suffix: 'Khách sạn' },
          { label: 'Quản lý người dùng', value: users.length, suffix: 'Người dùng' },
          { label: 'Quản lý đặt phòng', value: bookings.length, suffix: 'Đặt phòng' },
          { label: 'Doanh thu', value: revenueInMillion, suffix: 'Triệu VND' }
        ])

        // Simple chart data
        setHotelData([3, 5, 7, 8, hotels.length])
        setBookingData([2, 4, 6, 8, bookings.length])
      } else {
        // Fetch all data in parallel
        const [hotelsRes, usersRes, bookingsRes] = await Promise.all([
          hotelAPI.getAll().catch(() => ({ data: [] })),
          userAPI.getAll().catch(() => ({ data: [] })),
          bookingAPI.getAll().catch(() => ({ data: [] }))
        ])

        const hotels = Array.isArray(hotelsRes.data) ? hotelsRes.data : (Array.isArray(hotelsRes) ? hotelsRes : [])
        const users = Array.isArray(usersRes.data) ? usersRes.data : (Array.isArray(usersRes) ? usersRes : [])
        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : (Array.isArray(bookingsRes) ? bookingsRes : [])

        // Calculate revenue
        const revenue = bookings.reduce((sum, b) => {
          return sum + (parseFloat(b.tong_tien || b.total || 0))
        }, 0)
        const revenueInMillion = (revenue / 1000000).toFixed(2)

        setStats([
          { label: 'Quản lý khách sạn', value: hotels.length, suffix: 'Khách sạn' },
          { label: 'Quản lý người dùng', value: users.length, suffix: 'Người dùng' },
          { label: 'Quản lý đặt phòng', value: bookings.length, suffix: 'Đặt phòng' },
          { label: 'Doanh thu', value: revenueInMillion, suffix: 'Triệu VND' }
        ])

        // Simple chart data (last 5 months - placeholder)
        setHotelData([hotels.length * 0.3, hotels.length * 0.5, hotels.length * 0.7, hotels.length * 0.9, hotels.length])
        setBookingData([
          bookings.length * 0.2,
          bookings.length * 0.4,
          bookings.length * 0.6,
          bookings.length * 0.8,
          bookings.length
        ])
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderLines = (data) => {
    const max = Math.max(...data) || 1
    const width = 100
    const height = 50
    const stepX = width / (data.length - 1 || 1)

    const points = data
      .map((value, index) => {
        const x = index * stepX
        const y = height - (value / max) * height
        return `${x},${y}`
      })
      .join(' ')

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
        />
        {data.map((value, index) => {
          const x = index * stepX
          const y = height - (value / max) * height
          return <circle key={index} cx={x} cy={y} r="2.5" className="fill-sky-500" />
        })}
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-sky-500" size={32} />
        <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Bảng điều khiển</h1>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5 flex flex-col items-center text-center"
          >
            <p className="text-sm font-semibold text-slate-600 mb-1">{item.label}</p>
            <p className="text-3xl font-bold text-sky-600 mb-1">{item.value}</p>
            <p className="text-xs text-slate-400">{item.suffix}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Số lượng khách sạn</h2>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
            {renderLines(hotelData)}
          </div>
          <div className="flex justify-between mt-3 text-xs text-slate-500">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Số lượng đặt phòng</h2>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
            {renderLines(bookingData)}
          </div>
          <div className="flex justify-between mt-3 text-xs text-slate-500">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview


