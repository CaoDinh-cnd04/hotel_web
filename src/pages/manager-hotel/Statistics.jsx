import React, { useState, useEffect } from 'react'
import { Loader2, TrendingUp, DollarSign, Calendar, Bed, Star, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

const USE_MOCK_DATA = true

// Mock statistics data
const mockStats = {
  revenue: {
    today: 2500000,
    thisWeek: 15000000,
    thisMonth: 65000000,
    thisYear: 720000000,
    growth: 12.5
  },
  bookings: {
    today: 3,
    thisWeek: 18,
    thisMonth: 75,
    thisYear: 850,
    growth: 8.3
  },
  occupancy: {
    current: 75,
    average: 68,
    peak: 95,
    low: 35
  },
  reviews: {
    total: 245,
    average: 4.2,
    fiveStar: 120,
    fourStar: 80,
    threeStar: 30,
    twoStar: 10,
    oneStar: 5
  },
  monthlyRevenue: [
    { month: 'Tháng 1', revenue: 55000000 },
    { month: 'Tháng 2', revenue: 48000000 },
    { month: 'Tháng 3', revenue: 62000000 },
    { month: 'Tháng 4', revenue: 58000000 },
    { month: 'Tháng 5', revenue: 65000000 },
    { month: 'Tháng 6', revenue: 72000000 },
    { month: 'Tháng 7', revenue: 68000000 },
    { month: 'Tháng 8', revenue: 75000000 },
    { month: 'Tháng 9', revenue: 70000000 },
    { month: 'Tháng 10', revenue: 78000000 },
    { month: 'Tháng 11', revenue: 65000000 },
    { month: 'Tháng 12', revenue: 72000000 }
  ],
  topRooms: [
    { so_phong: '301', ten_phong: 'Phòng Suite', bookings: 45, revenue: 135000000 },
    { so_phong: '101', ten_phong: 'Phòng Deluxe View Sông', bookings: 42, revenue: 126000000 },
    { so_phong: '201', ten_phong: 'Phòng Gia Đình', bookings: 38, revenue: 190000000 },
    { so_phong: '302', ten_phong: 'Phòng Premium', bookings: 35, revenue: 154000000 },
    { so_phong: '202', ten_phong: 'Phòng Deluxe', bookings: 32, revenue: 115200000 }
  ]
}

const Statistics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState('month') // day, week, month, year

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setStats(mockStats)
      }
    } catch (err) {
      console.error('Error fetching statistics:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  const getRevenueForTimeRange = () => {
    if (!stats) return 0
    switch (timeRange) {
      case 'day': return stats.revenue.today
      case 'week': return stats.revenue.thisWeek
      case 'month': return stats.revenue.thisMonth
      case 'year': return stats.revenue.thisYear
      default: return stats.revenue.thisMonth
    }
  }

  const getBookingsForTimeRange = () => {
    if (!stats) return 0
    switch (timeRange) {
      case 'day': return stats.bookings.today
      case 'week': return stats.bookings.thisWeek
      case 'month': return stats.bookings.thisMonth
      case 'year': return stats.bookings.thisYear
      default: return stats.bookings.thisMonth
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Không có dữ liệu thống kê</p>
      </div>
    )
  }

  const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue))

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Thống kê</h1>
          <p className="text-slate-500 mt-1">Phân tích hiệu suất và doanh thu khách sạn</p>
        </div>
        <div className="flex items-center gap-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {range === 'day' ? 'Ngày' : range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <TrendingUp size={16} />
              +{stats.revenue.growth}%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">Doanh thu</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(getRevenueForTimeRange())}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <TrendingUp size={16} />
              +{stats.bookings.growth}%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">Đặt phòng</p>
          <p className="text-2xl font-bold text-slate-900">{getBookingsForTimeRange()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bed className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">Tỷ lệ lấp đầy</p>
          <p className="text-2xl font-bold text-slate-900">{stats.occupancy.current}%</p>
          <p className="text-xs text-slate-500 mt-1">Trung bình: {stats.occupancy.average}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">Đánh giá trung bình</p>
          <p className="text-2xl font-bold text-slate-900">{stats.reviews.average}/5</p>
          <p className="text-xs text-slate-500 mt-1">Tổng: {stats.reviews.total} đánh giá</p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Doanh thu theo tháng</h2>
          <div className="space-y-4">
            {stats.monthlyRevenue.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm text-slate-600">{item.month}</div>
                <div className="flex-1">
                  <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="absolute inset-y-0 left-0 bg-emerald-500 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {(item.revenue / 1000000).toFixed(0)}M
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Phân bố đánh giá</h2>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.reviews[`${rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one'}Star`]
              const percentage = (count / stats.reviews.total) * 100
              
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-semibold text-slate-700">
                    {rating} <Star className="inline w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="relative h-6 bg-slate-100 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: rating * 0.1, duration: 0.5 }}
                        className={`absolute inset-y-0 left-0 rounded-lg ${
                          rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <span className="text-xs font-semibold text-slate-700">{count}</span>
                        <span className="text-xs font-semibold text-slate-700">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Rooms */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Top phòng phổ biến</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Phòng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Số đặt phòng</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.topRooms.map((room, index) => (
                <motion.tr
                  key={room.so_phong}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-slate-800">Phòng {room.so_phong}</p>
                      <p className="text-sm text-slate-500">{room.ten_phong}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-700">{room.bookings}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-emerald-600">{formatCurrency(room.revenue)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Statistics

