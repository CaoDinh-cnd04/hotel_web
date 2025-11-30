import { useState, useEffect, useMemo } from 'react'
import { MapPin, Star, MessageCircle, Loader2, CheckCircle, Trash2, Reply, Eye, EyeOff } from 'lucide-react'
import { hotelAPI, reviewAPI } from '../services/api'
import { mockHotels, mockReviews } from '../data/mockData'
import FilterBar from '../components/FilterBar'

const USE_MOCK_DATA = false // Set to false when API is ready

const Hotels = () => {
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [reviews, setReviews] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingReviews, setLoadingReviews] = useState({})
  const [selectedReview, setSelectedReview] = useState(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [filters, setFilters] = useState({
    rating: 'Tất cả',
    location: 'Tất cả',
    reviewCount: 'Tất cả',
    status: 'Tất cả',
    search: ''
  })

  useEffect(() => {
    fetchHotels()
  }, [])

  useEffect(() => {
    if (selectedHotel) {
      fetchReviews(selectedHotel.ma_khach_san || selectedHotel.id)
    }
  }, [selectedHotel])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        setHotels(mockHotels)
        if (mockHotels.length > 0 && !selectedHotel) {
          setSelectedHotel(mockHotels[0])
        }
      } else {
        // Try to fetch hotels from API
        const response = await hotelAPI.getAll()
        
        // Handle different response formats
        let hotelsData = []
        if (Array.isArray(response)) {
          hotelsData = response
        } else if (response?.data) {
          hotelsData = Array.isArray(response.data) ? response.data : []
        } else if (response?.success && Array.isArray(response.data)) {
          hotelsData = response.data
        }
        
        setHotels(hotelsData)
        if (hotelsData.length > 0 && !selectedHotel) {
          setSelectedHotel(hotelsData[0])
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Không thể tải danh sách khách sạn'
      setError(errorMessage)
      console.error('Error fetching hotels:', {
        message: err.message,
        error: err,
        stack: err.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async (hotelId) => {
    try {
      setLoadingReviews((prev) => ({ ...prev, [hotelId]: true }))
      
      if (USE_MOCK_DATA) {
        // Use mock reviews
        await new Promise(resolve => setTimeout(resolve, 300))
        const reviewsData = mockReviews[hotelId] || []
        setReviews((prev) => ({
          ...prev,
          [hotelId]: reviewsData
        }))
      } else {
        // Use admin API to get all reviews (including pending)
        const response = await reviewAPI.getAllAdmin({ hotel_id: hotelId })
        const reviewsData = response.data || response || []
        setReviews((prev) => ({
          ...prev,
          [hotelId]: Array.isArray(reviewsData) ? reviewsData : []
        }))
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setReviews((prev) => ({ ...prev, [hotelId]: [] }))
    } finally {
      setLoadingReviews((prev) => ({ ...prev, [hotelId]: false }))
    }
  }

  const renderStars = (count) =>
    new Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < count ? 'text-amber-400 fill-amber-300' : 'text-slate-300'}
      />
    ))

  const getHotelStatus = (hotel) => {
    return hotel.trang_thai === 1 ? 'Đang hoạt động' : 'Chờ phê duyệt'
  }

  const calculateRating = (hotelReviews) => {
    if (!hotelReviews || hotelReviews.length === 0) return null
    // Only count approved reviews for rating calculation
    const approvedReviews = hotelReviews.filter(r => 
      (r.status || r.trang_thai) === 'Đã duyệt'
    )
    if (approvedReviews.length === 0) return null
    const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || r.so_sao_tong || r.diem_danh_gia || 0), 0)
    return (sum / approvedReviews.length).toFixed(1)
  }

  const handleUpdateReviewStatus = async (reviewId, newStatus) => {
    try {
      await reviewAPI.updateStatus(reviewId, newStatus)
      
      // Update local state
      const hotelId = selectedHotel.ma_khach_san || selectedHotel.id
      setReviews((prev) => ({
        ...prev,
        [hotelId]: (prev[hotelId] || []).map(r => 
          (r.id || r.ma_danh_gia) === reviewId 
            ? { ...r, status: newStatus, trang_thai: newStatus }
            : r
        )
      }))
      
      alert(`Đã cập nhật trạng thái đánh giá thành "${newStatus}"`)
    } catch (err) {
      console.error('Error updating review status:', err)
      alert('Lỗi khi cập nhật trạng thái: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return
    }
    
    try {
      await reviewAPI.delete(reviewId)
      
      // Update local state
      const hotelId = selectedHotel.ma_khach_san || selectedHotel.id
      setReviews((prev) => ({
        ...prev,
        [hotelId]: (prev[hotelId] || []).filter(r => 
          (r.id || r.ma_danh_gia) !== reviewId
        )
      }))
      
      alert('Đã xóa đánh giá thành công')
    } catch (err) {
      console.error('Error deleting review:', err)
      alert('Lỗi khi xóa đánh giá: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleRespondToReview = async () => {
    if (!responseText.trim()) {
      alert('Vui lòng nhập nội dung phản hồi')
      return
    }
    
    try {
      const reviewId = selectedReview.id || selectedReview.ma_danh_gia
      await reviewAPI.respond(reviewId, responseText)
      
      // Update local state
      const hotelId = selectedHotel.ma_khach_san || selectedHotel.id
      setReviews((prev) => ({
        ...prev,
        [hotelId]: (prev[hotelId] || []).map(r => 
          (r.id || r.ma_danh_gia) === reviewId 
            ? { 
                ...r, 
                hotel_response: responseText,
                phan_hoi_khach_san: responseText,
                response_date: new Date().toISOString(),
                ngay_phan_hoi: new Date().toISOString()
              }
            : r
        )
      }))
      
      setShowResponseModal(false)
      setResponseText('')
      setSelectedReview(null)
      alert('Đã gửi phản hồi thành công')
    } catch (err) {
      console.error('Error responding to review:', err)
      alert('Lỗi khi gửi phản hồi: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const getReviewStatusBadge = (status) => {
    const reviewStatus = status || 'Chờ duyệt'
    const statusConfig = {
      'Đã duyệt': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
      'Chờ duyệt': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Loader2 },
      'Đã ẩn': { bg: 'bg-slate-100', text: 'text-slate-700', icon: EyeOff }
    }
    
    const config = statusConfig[reviewStatus] || statusConfig['Chờ duyệt']
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {reviewStatus}
      </span>
    )
  }

  // Filter hotels based on filter criteria
  const filteredHotels = useMemo(() => {
    let filtered = [...hotels]

    // Filter by rating
    if (filters.rating !== 'Tất cả') {
      const ratingValue = parseInt(filters.rating.replace(' sao', ''))
      filtered = filtered.filter(h => (h.so_sao || h.stars || 0) === ratingValue)
    }

    // Filter by location
    if (filters.location !== 'Tất cả') {
      filtered = filtered.filter(h => {
        const address = (h.dia_chi || h.address || '').toLowerCase()
        return address.includes(filters.location.toLowerCase())
      })
    }

    // Filter by review count
    if (filters.reviewCount !== 'Tất cả') {
      filtered = filtered.filter(h => {
        const hotelId = h.ma_khach_san || h.id
        const reviewCount = (reviews[hotelId] || []).length
        switch (filters.reviewCount) {
          case '0-10':
            return reviewCount >= 0 && reviewCount <= 10
          case '11-50':
            return reviewCount >= 11 && reviewCount <= 50
          case '51-100':
            return reviewCount >= 51 && reviewCount <= 100
          case '100+':
            return reviewCount > 100
          default:
            return true
        }
      })
    }

    // Filter by status
    if (filters.status !== 'Tất cả') {
      filtered = filtered.filter(h => {
        const status = getHotelStatus(h)
        return status === filters.status
      })
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(h => {
        const name = (h.ten_khach_san || h.name || '').toLowerCase()
        const address = (h.dia_chi || h.address || '').toLowerCase()
        return name.includes(searchLower) || address.includes(searchLower)
      })
    }

    return filtered
  }, [hotels, reviews, filters])

  // Update selected hotel if it's filtered out
  useEffect(() => {
    if (selectedHotel && !filteredHotels.find(h => 
      (h.ma_khach_san || h.id) === (selectedHotel.ma_khach_san || selectedHotel.id)
    )) {
      if (filteredHotels.length > 0) {
        setSelectedHotel(filteredHotels[0])
      } else {
        setSelectedHotel(null)
      }
    }
  }, [filteredHotels, selectedHotel])

  if (loading && hotels.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-sky-500" size={32} />
        <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  if (error && hotels.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchHotels}
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (!selectedHotel) {
    return (
      <div className="p-8 text-center text-slate-500">
        Chưa có khách sạn nào
      </div>
    )
  }

  const hotelReviews = reviews[selectedHotel.ma_khach_san || selectedHotel.id] || []
  const rating = calculateRating(hotelReviews)

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý khách sạn</h1>
          <p className="text-slate-500 mt-1">Theo dõi trạng thái hoạt động, địa chỉ và đánh giá của khách.</p>
        </div>
        <div className="flex gap-3">
          <div className="inline-flex flex-col px-4 py-2 rounded-xl bg-slate-900 text-white">
            <span className="text-xs text-white/70">Tổng khách sạn</span>
            <span className="text-xl font-bold">{hotels.length}</span>
          </div>
          <div className="inline-flex flex-col px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700">
            <span className="text-xs">Đang hoạt động</span>
            <span className="text-xl font-bold">
              {hotels.filter((item) => item.status === 'Đang hoạt động').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        options={{
          showRating: true,
          showLocation: true,
          showReviewCount: true,
          showStatus: true,
          showSearch: true,
          statusOptions: ['Tất cả', 'Đang hoạt động', 'Chờ phê duyệt'],
          searchPlaceholder: 'Tìm theo tên khách sạn, địa chỉ...',
          title: 'Bộ lọc khách sạn',
          description: 'Lọc khách sạn theo số sao, địa điểm, số phản hồi và trạng thái.'
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Danh sách khách sạn</h2>
            <p className="text-sm text-slate-500">Chọn khách sạn để xem chi tiết</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {filteredHotels.length === 0 ? (
              <li className="px-6 py-8 text-center text-slate-500">
                Không tìm thấy khách sạn nào phù hợp với bộ lọc
              </li>
            ) : (
              filteredHotels.map((hotel) => {
              const hotelId = hotel.ma_khach_san || hotel.id
              const isSelected = (selectedHotel.ma_khach_san || selectedHotel.id) === hotelId
              const status = getHotelStatus(hotel)
              const hotelReviews = reviews[hotelId] || []
              const hotelRating = calculateRating(hotelReviews)
              
              return (
                <li key={hotelId}>
                  <button
                    onClick={() => setSelectedHotel(hotel)}
                    className={`w-full text-left px-6 py-4 flex flex-col gap-1 transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-50 ring-2 ring-sky-200 scale-[1.01]'
                        : 'hover:bg-slate-50 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{hotel.ten_khach_san || hotel.name}</p>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          status === 'Đang hoạt động'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {hotel.dia_chi || hotel.address || 'Chưa có địa chỉ'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        {renderStars(hotel.so_sao || hotel.stars || 0)}
                      </div>
                      {hotelRating ? (
                        <span className="font-semibold text-slate-700">
                          {hotelRating}/5 ({hotelReviews.length} đánh giá)
                        </span>
                      ) : (
                        <span className="italic text-slate-400">Chưa có đánh giá</span>
                      )}
                    </div>
                  </button>
                </li>
              )
            }))}
          </ul>
        </section>

        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow">
          <div key={selectedHotel.ma_khach_san || selectedHotel.id} className="animate-fade-slide">
            <div className="px-6 py-5 border-b border-slate-100 bg-sky-600 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold">{selectedHotel.ten_khach_san || selectedHotel.name}</h2>
              <p className="text-sm text-white/80 flex items-center gap-2">
                <MapPin size={16} />
                {selectedHotel.dia_chi || selectedHotel.address || 'Chưa có địa chỉ'}
              </p>
            </div>
            <div className="p-6 grid gap-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <div className="text-3xl font-bold text-slate-900">
                    {selectedHotel.so_sao || selectedHotel.stars || 0}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase">Số sao</p>
                    <div className="flex gap-1">
                      {renderStars(selectedHotel.so_sao || selectedHotel.stars || 0)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <div className="text-3xl font-bold text-slate-900">
                    {rating || '--'}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase">Điểm trung bình</p>
                    <p className="text-sm text-slate-600">{hotelReviews.length} đánh giá</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MessageCircle size={18} className="text-sky-500" />
                    Đánh giá {showAllReviews ? 'tất cả' : 'gần đây'}
                    {loadingReviews[selectedHotel.ma_khach_san || selectedHotel.id] && (
                      <Loader2 className="animate-spin text-sky-500" size={16} />
                    )}
                  </h3>
                  {hotelReviews.length > 5 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      {showAllReviews ? 'Thu gọn' : `Xem tất cả (${hotelReviews.length})`}
                    </button>
                  )}
                </div>
                {hotelReviews.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">Khách sạn chưa có đánh giá nào.</p>
                ) : (
                  <div className="space-y-4">
                    {(showAllReviews ? hotelReviews : hotelReviews.slice(0, 5)).map((review, index) => {
                      const reviewId = review.id || review.ma_danh_gia
                      const reviewStatus = review.status || review.trang_thai || 'Chờ duyệt'
                      const reviewRating = review.rating || review.so_sao_tong || review.diem_danh_gia || 0
                      const reviewContent = review.content || review.binh_luan || review.comment || review.noi_dung || 'Không có bình luận'
                      const customerName = review.customer_name || review.ho_ten || review.ten_nguoi_dung || review.ten_khach_hang || 'Khách'
                      const reviewDate = review.review_date || review.ngay || review.ngay_danh_gia || review.ngay_tao
                      const hotelResponse = review.hotel_response || review.phan_hoi_khach_san
                      const responseDate = review.response_date || review.ngay_phan_hoi
                      
                      return (
                        <div
                          key={reviewId || index}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900">
                                  {customerName}
                                </span>
                                {getReviewStatusBadge(reviewStatus)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  {renderStars(reviewRating)}
                                </div>
                                <span>({reviewRating}/5)</span>
                                {reviewDate && (
                                  <span>• {new Date(reviewDate).toLocaleDateString('vi-VN')}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {reviewStatus === 'Chờ duyệt' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateReviewStatus(reviewId, 'Đã duyệt')}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Duyệt đánh giá"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateReviewStatus(reviewId, 'Đã ẩn')}
                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Ẩn đánh giá"
                                  >
                                    <EyeOff size={16} />
                                  </button>
                                </>
                              )}
                              {reviewStatus === 'Đã duyệt' && (
                                <button
                                  onClick={() => handleUpdateReviewStatus(reviewId, 'Đã ẩn')}
                                  className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                  title="Ẩn đánh giá"
                                >
                                  <EyeOff size={16} />
                                </button>
                              )}
                              {reviewStatus === 'Đã ẩn' && (
                                <button
                                  onClick={() => handleUpdateReviewStatus(reviewId, 'Đã duyệt')}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Hiển thị đánh giá"
                                >
                                  <Eye size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedReview(review)
                                  setShowResponseModal(true)
                                }}
                                className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                title="Phản hồi đánh giá"
                              >
                                <Reply size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(reviewId)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa đánh giá"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-700 mt-2 mb-2">
                            {reviewContent}
                          </p>
                          {hotelResponse && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="flex items-start gap-2">
                                <div className="flex-1 bg-sky-50 rounded-lg px-3 py-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-sky-700">Phản hồi từ khách sạn</span>
                                    {responseDate && (
                                      <span className="text-xs text-slate-500">
                                        {new Date(responseDate).toLocaleDateString('vi-VN')}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-700">{hotelResponse}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              
              {/* Response Modal */}
              {showResponseModal && selectedReview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Phản hồi đánh giá
                    </h3>
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-semibold">{selectedReview.customer_name || selectedReview.ho_ten || 'Khách'}</span>
                        {' - '}
                        {new Date(selectedReview.review_date || selectedReview.ngay || Date.now()).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-slate-700">
                        {selectedReview.content || selectedReview.binh_luan || selectedReview.comment || 'Không có bình luận'}
                      </p>
                    </div>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Nhập phản hồi của bạn..."
                      className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setShowResponseModal(false)
                          setResponseText('')
                          setSelectedReview(null)
                        }}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleRespondToReview}
                        className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Hotels

