import { useState, useEffect } from 'react'
import { Search, Star, Trash2, Loader2, Filter, BarChart3, MessageSquare, Calendar, CheckCircle, XCircle, Download, Reply } from 'lucide-react'
import { reviewAPI } from '../../../admin_hotel/src/services/api'
import { mockReviewsAdmin, mockReviewStats, mockHotelsForFilter } from '../../../admin_hotel/src/data/mockData'

const USE_MOCK_DATA = true // Set to true to use mock data

const ratingOptions = ['Tất cả', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao']
const statusOptions = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã ẩn']

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [filter, setFilter] = useState({
    rating: 'Tất cả',
    status: 'Tất cả',
    hotel_id: 'all',
    search: '',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchReviews()
    fetchStats()
    fetchHotels()
  }, [filter.page, filter.rating, filter.status, filter.hotel_id])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        let filteredReviews = [...mockReviewsAdmin]
        
        // Apply filters
        if (filter.rating !== 'Tất cả') {
          const ratingValue = parseInt(filter.rating.replace(' sao', ''))
          filteredReviews = filteredReviews.filter(r => (r.rating || r.so_sao_tong) === ratingValue)
        }
        
        if (filter.status !== 'Tất cả') {
          filteredReviews = filteredReviews.filter(r => (r.status || r.trang_thai) === filter.status)
        }
        
        if (filter.hotel_id !== 'all') {
          filteredReviews = filteredReviews.filter(r => r.hotel_id === parseInt(filter.hotel_id))
        }
        
        if (filter.search) {
          const searchLower = filter.search.toLowerCase()
          filteredReviews = filteredReviews.filter(r => 
            (r.customer_name || '').toLowerCase().includes(searchLower) ||
            (r.hotel_name || '').toLowerCase().includes(searchLower) ||
            (r.content || r.binh_luan || '').toLowerCase().includes(searchLower)
          )
        }
        
        // Sort by date DESC
        filteredReviews.sort((a, b) => {
          const dateA = new Date(a.review_date || a.ngay || 0)
          const dateB = new Date(b.review_date || b.ngay || 0)
          return dateB - dateA
        })
        
        // Pagination
        const total = filteredReviews.length
        const startIndex = (filter.page - 1) * filter.limit
        const endIndex = startIndex + filter.limit
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex)
        
        setReviews(paginatedReviews)
        setPagination({
          page: filter.page,
          limit: filter.limit,
          total: total,
          totalPages: Math.ceil(total / filter.limit)
        })
      } else {
        const params = {
          page: filter.page,
          limit: filter.limit,
          sort_by: 'ngay',
          sort_order: 'DESC'
        }

        if (filter.rating !== 'Tất cả') {
          params.rating = filter.rating.replace(' sao', '')
        }

        if (filter.status !== 'Tất cả') {
          params.status = filter.status
        }

        if (filter.hotel_id !== 'all') {
          params.hotel_id = filter.hotel_id
        }

        if (filter.search) {
          params.search = filter.search
        }

        const response = await reviewAPI.getAllAdmin(params)
        const reviewsData = response.data || []
        const paginationData = response.pagination || {}

        setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        setPagination(paginationData)
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách đánh giá')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setStats(mockReviewStats)
      } else {
        const response = await reviewAPI.getStats()
        setStats(response.data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchHotels = async () => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setHotels(mockHotelsForFilter)
      } else {
        const response = await reviewAPI.getHotels()
        setHotels(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching hotels:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) {
      return
    }

    try {
      await reviewAPI.delete(id)
      alert('Xóa đánh giá thành công!')
      fetchReviews()
      fetchStats()
    } catch (err) {
      alert('Lỗi khi xóa đánh giá: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleApprove = async (id) => {
    try {
      await reviewAPI.updateStatus(id, 'Đã duyệt')
      alert('Đã duyệt đánh giá thành công!')
      fetchReviews()
      fetchStats()
    } catch (err) {
      alert('Lỗi khi duyệt đánh giá: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có muốn ẩn đánh giá này không?')) {
      return
    }
    try {
      await reviewAPI.updateStatus(id, 'Đã ẩn')
      alert('Đã ẩn đánh giá thành công!')
      fetchReviews()
      fetchStats()
    } catch (err) {
      alert('Lỗi khi ẩn đánh giá: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleOpenResponseDialog = (review) => {
    setSelectedReview(review)
    setResponseText('')
    setShowResponseDialog(true)
  }

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      alert('Vui lòng nhập nội dung phản hồi')
      return
    }

    try {
      await reviewAPI.respond(selectedReview.id, responseText)
      alert('Đã gửi phản hồi thành công!')
      setShowResponseDialog(false)
      setResponseText('')
      fetchReviews()
      fetchStats()
    } catch (err) {
      alert('Lỗi khi gửi phản hồi: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ['ID', 'Khách hàng', 'Email', 'Khách sạn', 'Số sao', 'Nội dung', 'Ngày đánh giá', 'Trạng thái', 'Có phản hồi']
      const rows = reviews.map(review => [
        review.id,
        review.customer_name || 'N/A',
        review.customer_email || 'N/A',
        review.hotel_name || 'N/A',
        review.rating || review.so_sao_tong || 0,
        (review.content || review.binh_luan || '').replace(/"/g, '""'), // Escape quotes
        formatDate(review.review_date || review.ngay),
        review.status || review.trang_thai || 'N/A',
        review.hotel_response ? 'Có' : 'Không'
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `danh_sach_danh_gia_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert('Đã xuất file CSV thành công!')
    } catch (err) {
      alert('Lỗi khi xuất file: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-slate-700">{rating}</span>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'Đã duyệt': 'bg-emerald-100 text-emerald-700',
      'Chờ duyệt': 'bg-amber-100 text-amber-700',
      'Đã ẩn': 'bg-gray-100 text-gray-700'
    }
    const className = statusMap[status] || 'bg-gray-100 text-gray-700'
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
        {status || 'N/A'}
      </span>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý đánh giá</h1>
          <p className="text-slate-500 mt-1">
            Xem, quản lý và xóa các đánh giá từ khách hàng về khách sạn.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold shadow">
              <BarChart3 size={18} />
              Tổng: {stats.total_reviews} đánh giá
            </div>
          )}
          {reviews.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-colors"
            >
              <Download size={18} />
              Xuất CSV
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total_reviews}</p>
              </div>
              <MessageSquare className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Đánh giá trung bình</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-900">{stats.average_rating?.toFixed(1) || '0'}</p>
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                </div>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Đánh giá 30 ngày</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.recent_reviews}</p>
              </div>
              <Calendar className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Có phản hồi</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.with_response}</p>
              </div>
              <MessageSquare className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Top Hotels */}
      {stats && stats.top_hotels && stats.top_hotels.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top khách sạn được đánh giá</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.top_hotels.slice(0, 5).map((hotel, index) => (
              <div key={hotel.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-sky-600">#{index + 1}</span>
                  <Star className="fill-yellow-400 text-yellow-400" size={16} />
                  <span className="text-sm font-semibold">{parseFloat(hotel.avg_rating || 0).toFixed(1)}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">{hotel.hotel_name}</p>
                <p className="text-xs text-slate-500">{hotel.review_count} đánh giá</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {stats && stats.rating_distribution && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Phân bố đánh giá</h3>
          <div className="grid grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.rating_distribution[`${rating}_star`] || 0
              const total = stats.total_reviews || 1
              const percentage = ((count / total) * 100).toFixed(1)
              
              return (
                <div key={rating} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-sm text-slate-500">{percentage}%</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow mb-6">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Filter size={20} />
            Bộ lọc
          </h2>
          <p className="text-sm text-slate-500">Tìm kiếm và lọc đánh giá theo tiêu chí.</p>
        </div>
        <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Số sao
            <select
              value={filter.rating}
              onChange={(e) => setFilter({ ...filter, rating: e.target.value, page: 1 })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {ratingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Trạng thái
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Khách sạn
            <select
              value={filter.hotel_id}
              onChange={(e) => setFilter({ ...filter, hotel_id: e.target.value, page: 1 })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">Tất cả khách sạn</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Tìm kiếm
            <div className="mt-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value, page: 1 })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    fetchReviews()
                  }
                }}
                placeholder="Tìm theo tên khách hàng, khách sạn, nội dung..."
                className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </label>
        </div>
      </section>

      {/* Reviews Table */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-slate-100 bg-sky-600 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Danh sách đánh giá</h2>
          <p className="text-sm text-white/80">
            Hiển thị {reviews.length} / {pagination.total} đánh giá
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-sky-500 text-white text-sm uppercase tracking-wide">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Khách hàng</th>
                <th className="py-3 px-4 text-left">Khách sạn</th>
                <th className="py-3 px-4 text-left">Đánh giá</th>
                <th className="py-3 px-4 text-left">Nội dung</th>
                <th className="py-3 px-4 text-left">Ngày đánh giá</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <Loader2 className="animate-spin text-sky-500 mx-auto" size={24} />
                    <span className="ml-2 text-slate-600">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={fetchReviews}
                      className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                      Thử lại
                    </button>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {filter.search || filter.rating !== 'Tất cả' || filter.status !== 'Tất cả' || filter.hotel_id !== 'all'
                      ? 'Không tìm thấy đánh giá nào'
                      : 'Chưa có đánh giá nào'}
                  </td>
                </tr>
              ) : (
                reviews.map((review) => {
                  const content = review.content || review.binh_luan || 'Không có nội dung'
                  const truncatedContent = content.length > 100 
                    ? content.substring(0, 100) + '...' 
                    : content
                  const status = review.status || review.trang_thai

                  return (
                    <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{review.id}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {review.customer_avatar ? (
                            <img 
                              src={review.customer_avatar} 
                              alt={review.customer_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-slate-600">
                                {(review.customer_name || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {review.customer_name || 'Khách hàng'}
                            </p>
                            <p className="text-xs text-slate-500">{review.customer_email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-slate-900">{review.hotel_name || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{review.hotel_address || ''}</p>
                      </td>
                      <td className="py-4 px-4">
                        {renderStars(review.rating || review.so_sao_tong || 0)}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-700 max-w-xs">{truncatedContent}</p>
                        {review.hotel_response && (
                          <p className="text-xs text-blue-600 mt-1">
                            ✓ Có phản hồi
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {formatDate(review.review_date || review.ngay)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {status === 'Chờ duyệt' && (
                            <button
                              onClick={() => handleApprove(review.id)}
                              className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                              title="Duyệt đánh giá"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {status !== 'Đã ẩn' && (
                            <button
                              onClick={() => handleReject(review.id)}
                              className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                              title="Ẩn đánh giá"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenResponseDialog(review)}
                            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            title="Phản hồi"
                          >
                            <Reply size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Xóa đánh giá"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Trang {pagination.page} / {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter({ ...filter, page: Math.max(1, filter.page - 1) })}
                disabled={filter.page === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setFilter({ ...filter, page: Math.min(pagination.totalPages, filter.page + 1) })}
                disabled={filter.page >= pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Response Dialog */}
      {showResponseDialog && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Phản hồi đánh giá</h3>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Khách hàng: <span className="font-semibold">{selectedReview.customer_name}</span></p>
              <p className="text-sm text-slate-600 mb-2">Khách sạn: <span className="font-semibold">{selectedReview.hotel_name}</span></p>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg mb-4">
                "{selectedReview.content || selectedReview.binh_luan || 'N/A'}"
              </p>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nội dung phản hồi
            </label>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400 min-h-[120px]"
              rows={4}
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowResponseDialog(false)
                  setResponseText('')
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSendResponse}
                className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reviews
